import { Link, useParams } from "react-router-dom";
import { mockShipments } from "../../mocks/shipments";

export function ShipmentDetailPage() {
  const { id } = useParams();
  const shipment = mockShipments.find((item) => item.id === id);

  if (!shipment) {
    return (
      <section className="panel">
        <h2>Shipment not found</h2>
        <p>The ID you entered does not exist in current frontend mock data.</p>
        <Link className="link-btn" to="/shipments">
          Back to shipments
        </Link>
      </section>
    );
  }

  return (
    <section>
      <p className="eyebrow">Shipment Detail</p>
      <h2 className="page-title">{shipment.id}</h2>

      <div className="detail-grid">
        <article className="panel">
          <h3>Route</h3>
          <p>
            <strong>Origin:</strong> {shipment.origin}
          </p>
          <p>
            <strong>Destination:</strong> {shipment.destination}
          </p>
          <p>
            <strong>Weight:</strong> {shipment.weightKg} kg
          </p>
          <p>
            <strong>Current Status:</strong> {shipment.status}
          </p>
        </article>

        <article className="panel">
          <h3>Latest Coordinates</h3>
          <p>
            <strong>Latitude:</strong> {shipment.lastLocation.latitude}
          </p>
          <p>
            <strong>Longitude:</strong> {shipment.lastLocation.longitude}
          </p>
          <p>
            <strong>ETA:</strong> {shipment.eta}
          </p>
        </article>
      </div>

      <article className="panel">
        <h3>Status Timeline</h3>
        <ul className="timeline-list">
          {shipment.statusTimeline.map((step) => (
            <li key={`${step.status}-${step.timestamp}`}>
              <strong>{step.status}</strong> - {step.timestamp}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
