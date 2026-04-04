import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorState } from "../../components/common/ErrorState";
import { LoadingState } from "../../components/common/LoadingState";
import { getShipmentById } from "../../services/shipmentService";

export function ShipmentDetailPage() {
  const { id } = useParams();
  const [shipment, setShipment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadShipment = async () => {
    if (!id) {
      setIsLoading(false);
      setErrorMessage("Shipment id is missing in URL.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      const data = await getShipmentById(id);
      setShipment(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load shipment details.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShipment();
  }, [id]);

  if (isLoading) {
    return (
      <section className="panel">
        <LoadingState
          title="Loading shipment details"
          message="Preparing route, timeline, and tracking cards."
        />
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="panel">
        <ErrorState
          title="Unable to open shipment"
          message={errorMessage}
          actionLabel="Try again"
          onAction={loadShipment}
        />
      </section>
    );
  }

  if (!shipment) {
    return (
      <section className="panel">
        <EmptyState
          title="Shipment not found"
          message="The shipment id does not match any available record."
        />
      </section>
    );
  }

  return (
    <section>
      <div className="detail-header">
        <div>
          <p className="eyebrow">Shipment Detail</p>
          <h2 className="page-title">{shipment.id}</h2>
        </div>
        <Link className="btn btn-secondary" to="/shipments">
          Back to Shipments
        </Link>
      </div>

      <div className="detail-grid">
        <article className="panel">
          <h3>Route Summary</h3>
          <div className="kv-list">
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
              <strong>Status:</strong>{" "}
              <span className={`status-pill status-${shipment.status.toLowerCase()}`}>
                {shipment.status}
              </span>
            </p>
          </div>
        </article>

        <article className="panel">
          <h3>Location Card</h3>
          <div className="kv-list">
            <p>
              <strong>Latitude:</strong> {shipment.lastLocation.latitude}
            </p>
            <p>
              <strong>Longitude:</strong> {shipment.lastLocation.longitude}
            </p>
            <p>
              <strong>ETA:</strong> {shipment.eta}
            </p>
          </div>
        </article>
      </div>

      <article className="panel">
        <h3>Timeline Card</h3>
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
