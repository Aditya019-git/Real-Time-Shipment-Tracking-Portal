package com.logistics.shipment_tracker.controller;

import com.logistics.shipment_tracker.dto.request.ShipmentRequest;
import com.logistics.shipment_tracker.dto.response.LocationUpdateResponse;
import com.logistics.shipment_tracker.dto.response.ShipmentResponse;
import com.logistics.shipment_tracker.dto.response.ShipmentSummaryResponse;
import com.logistics.shipment_tracker.exception.UnauthorizedException;
import com.logistics.shipment_tracker.service.ShipmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/shipments")
public class ShipmentController {

    private final ShipmentService shipmentService;

    public ShipmentController(ShipmentService shipmentService) {
        this.shipmentService = shipmentService;
    }

    @PostMapping
    @PreAuthorize("hasRole('SHIPPER')")
    public ResponseEntity<ShipmentResponse> createShipment(@Valid @RequestBody ShipmentRequest request) {
        String username = getCurrentUsername();
        ShipmentResponse response = shipmentService.createShipment(request, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ShipmentSummaryResponse>> getShipments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CARRIER"))) {
            List<ShipmentSummaryResponse> shipments = shipmentService.getAllShipmentsForCarrier();
            return ResponseEntity.ok(shipments);
        }

        if (authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_SHIPPER"))) {
            String username = authentication.getName();
            List<ShipmentSummaryResponse> shipments = shipmentService.getMyShipments(username);
            return ResponseEntity.ok(shipments);
        }

        throw new UnauthorizedException("You are not authorized to view shipments");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShipmentResponse> getShipment(@PathVariable UUID id) {
        ShipmentResponse response = shipmentService.getShipmentById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<LocationUpdateResponse>> getShipmentHistory(@PathVariable UUID id) {
        List<LocationUpdateResponse> history = shipmentService.getShipmentStatusHistory(id);
        return ResponseEntity.ok(history);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SHIPPER')")
    public ResponseEntity<ShipmentResponse> updateShipment(@PathVariable UUID id,
                                                           @Valid @RequestBody ShipmentRequest request) {
        String username = getCurrentUsername();
        ShipmentResponse response = shipmentService.updateShipment(id, request, username);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SHIPPER')")
    public ResponseEntity<Void> cancelShipment(@PathVariable UUID id) {
        String username = getCurrentUsername();
        shipmentService.cancelShipment(id, username);
        return ResponseEntity.noContent().build();
    }

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
