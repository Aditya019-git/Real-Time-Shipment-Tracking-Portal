package com.logistics.shipment_tracker.service;

import com.logistics.shipment_tracker.dto.response.ShipmentUpdateEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class ShipmentStreamService {

    private static final Logger log = LoggerFactory.getLogger(ShipmentStreamService.class);

    private final Map<UUID, List<SseEmitter>> emitterRegistry = new ConcurrentHashMap<>();

    public SseEmitter subscribe(UUID shipmentId) {
        SseEmitter emitter = new SseEmitter(0L); // no timeout; client can close

        emitter.onTimeout(emitter::complete);
        emitter.onError(ex -> emitter.complete());
        emitter.onCompletion(() -> removeEmitter(shipmentId, emitter));

        emitterRegistry.compute(shipmentId, (id, list) -> {
            if (list == null) {
                return List.of(emitter);
            }
            return concat(list, emitter);
        });

        // Send a welcome/heartbeat event immediately
        sendInternal(emitter, new ShipmentUpdateEvent(
                shipmentId,
                null,
                "stream_open",
                LocalDateTime.now()
        ));

        return emitter;
    }

    public void publish(UUID shipmentId, ShipmentUpdateEvent event) {
        List<SseEmitter> emitters = emitterRegistry.get(shipmentId);
        if (emitters == null || emitters.isEmpty()) {
            return;
        }

        List<SseEmitter> alive = emitters.stream()
                .filter(emitter -> sendInternal(emitter, event))
                .collect(Collectors.toList());

        emitterRegistry.put(shipmentId, alive);
    }

    private boolean sendInternal(SseEmitter emitter, ShipmentUpdateEvent event) {
        try {
            emitter.send(SseEmitter.event()
                    .name("shipment-update")
                    .data(event, MediaType.APPLICATION_JSON));
            return true;
        } catch (IOException e) {
            log.debug("SSE emitter send failed, removing emitter", e);
            emitter.complete();
            return false;
        }
    }

    private void removeEmitter(UUID shipmentId, SseEmitter emitter) {
        emitterRegistry.computeIfPresent(shipmentId, (id, list) ->
                list.stream().filter(e -> e != emitter).collect(Collectors.toList()));
    }

    private List<SseEmitter> concat(List<SseEmitter> list, SseEmitter emitter) {
        return list.stream()
                .collect(Collectors.collectingAndThen(Collectors.toList(), l -> {
                    l.add(emitter);
                    return l;
                }));
    }
}
