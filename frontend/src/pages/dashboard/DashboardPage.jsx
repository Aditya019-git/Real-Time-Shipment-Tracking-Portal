import { mockShipments } from "../../mocks/shipments";

const statusOrder = [
  "POSTED",
  "AWARDED",
  "AWAITING_PICKUP",
  "IN_TRANSIT",
  "DELIVERED",
];

export function DashboardPage() {
  const inTransitCount = mockShipments.filter(
    (shipment) => shipment.status === "IN_TRANSIT",
  ).length;

  return (
    <section>
      <p className="eyebrow">Overview</p>
      <h2 className="page-title">Live Logistics Snapshot</h2>

      <div className="stats-grid">
        <article className="stat-card">
          <p>Total Shipments</p>
          <h3>{mockShipments.length}</h3>
        </article>
        <article className="stat-card">
          <p>In Transit</p>
          <h3>{inTransitCount}</h3>
        </article>
        <article className="stat-card">
          <p>Delivered</p>
          <h3>
            {mockShipments.filter((shipment) => shipment.status === "DELIVERED").length}
          </h3>
        </article>
      </div>

      <section className="panel">
        <h3>Status Pipeline</h3>
        <div className="timeline-row">
          {statusOrder.map((status) => {
            const count = mockShipments.filter((shipment) => shipment.status === status).length;
            return (
              <div className="timeline-node" key={status}>
                <span>{status}</span>
                <strong>{count}</strong>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}
