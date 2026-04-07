package com.logistics.shipment_tracker.service;

import com.logistics.shipment_tracker.dto.request.ShipmentRequest;
import com.logistics.shipment_tracker.dto.response.LocationUpdateResponse;
import com.logistics.shipment_tracker.dto.response.ShipmentResponse;
import com.logistics.shipment_tracker.dto.response.ShipmentSummaryResponse;
import com.logistics.shipment_tracker.entity.LocationUpdate;
import com.logistics.shipment_tracker.entity.Shipment;
import com.logistics.shipment_tracker.entity.User;
import com.logistics.shipment_tracker.enums.ShipmentStatus;
import com.logistics.shipment_tracker.exception.BadRequestException;
import com.logistics.shipment_tracker.exception.ResourceNotFoundException;
import com.logistics.shipment_tracker.exception.UnauthorizedException;
import com.logistics.shipment_tracker.repository.LocationUpdateRepository;
import com.logistics.shipment_tracker.repository.ShipmentRepository;
import com.logistics.shipment_tracker.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final UserRepository userRepository;
    private final LocationUpdateRepository locationUpdateRepository;

    public ShipmentService(ShipmentRepository shipmentRepository,
                           UserRepository userRepository,
                           LocationUpdateRepository locationUpdateRepository) {
        this.shipmentRepository = shipmentRepository;
        this.userRepository = userRepository;
        this.locationUpdateRepository = locationUpdateRepository;
    }

    @Transactional
    public ShipmentResponse createShipment(ShipmentRequest request, String username) {
        User shipper = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Shipment shipment = Shipment.builder()
                .shipper(shipper)
                .origin(request.getOrigin())
                .destination(request.getDestination())
                .weightKg(request.getWeightKg())
                .description(request.getDescription())
                .status(ShipmentStatus.POSTED)
                .build();

        Shipment savedShipment = shipmentRepository.save(shipment);
        return ShipmentResponse.fromEntity(savedShipment);
    }

    @Transactional(readOnly = true)
    public List<ShipmentSummaryResponse> getAllShipmentsForCarrier() {
        return shipmentRepository.findByStatus(ShipmentStatus.POSTED)
                .stream()
                .map(ShipmentSummaryResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ShipmentSummaryResponse> getMyShipments(String username) {
        User shipper = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return shipmentRepository.findByShipper(shipper)
                .stream()
                .map(ShipmentSummaryResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public ShipmentResponse getShipmentById(UUID id) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found"));
        return ShipmentResponse.fromEntity(shipment);
    }

    @Transactional(readOnly = true)
    public List<LocationUpdateResponse> getShipmentStatusHistory(UUID id) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found"));

        List<LocationUpdate> updates = locationUpdateRepository.findByShipmentOrderByTimestampAsc(shipment);
        return updates.stream()
                .map(LocationUpdateResponse::fromEntity)
                .toList();
    }

    @Transactional
    public ShipmentResponse updateShipment(UUID id, ShipmentRequest request, String username) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found"));

        if (!shipment.getShipper().getUsername().equals(username)) {
            throw new UnauthorizedException("You are not allowed to update this shipment");
        }

        if (shipment.getStatus() != ShipmentStatus.POSTED) {
            throw new BadRequestException("Cannot update shipment that is not in POSTED status");
        }

        shipment.setOrigin(request.getOrigin());
        shipment.setDestination(request.getDestination());
        shipment.setWeightKg(request.getWeightKg());
        shipment.setDescription(request.getDescription());

        Shipment updatedShipment = shipmentRepository.save(shipment);
        return ShipmentResponse.fromEntity(updatedShipment);
    }

    @Transactional
    public void cancelShipment(UUID id, String username) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found"));

        if (!shipment.getShipper().getUsername().equals(username)) {
            throw new UnauthorizedException("You are not allowed to cancel this shipment");
        }

        if (shipment.getStatus() != ShipmentStatus.POSTED) {
            throw new BadRequestException("Cannot cancel shipment that is not in POSTED status");
        }

        shipment.setStatus(ShipmentStatus.CANCELLED);
        shipmentRepository.save(shipment);
    }
}
