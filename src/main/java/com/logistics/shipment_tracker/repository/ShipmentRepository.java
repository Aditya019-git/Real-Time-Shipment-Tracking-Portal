package com.logistics.shipment_tracker.repository;

import com.logistics.shipment_tracker.entity.Shipment;
import com.logistics.shipment_tracker.entity.User;
import com.logistics.shipment_tracker.enums.ShipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, UUID> {

    List<Shipment> findByShipper(User shipper);

    List<Shipment> findByStatus(ShipmentStatus status);

    List<Shipment> findByShipperAndStatus(User shipper, ShipmentStatus status);
}
