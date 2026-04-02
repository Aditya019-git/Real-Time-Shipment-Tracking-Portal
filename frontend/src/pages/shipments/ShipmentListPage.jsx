import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { mockShipments } from "../../mocks/shipments";

export function ShipmentListPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) {
      return mockShipments;
    }

    return mockShipments.filter((shipment) => {
      return (
        shipment.id.toLowerCase().includes(text) ||
        shipment.origin.toLowerCase().includes(text) ||
        shipment.destination.toLowerCase().includes(text)
      );
    });
  }, [query]);

  return (
    <section>
      <p className="eyebrow">Load Board</p>
      <div className="title-row">
        <h2 className="page-title">Shipments</h2>
        <input
          className="text-input search"
          placeholder="Search by ID, origin, destination"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="panel table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Route</th>
              <th>Weight</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((shipment) => (
              <tr key={shipment.id}>
                <td>{shipment.id}</td>
                <td>
                  {shipment.origin} to {shipment.destination}
                </td>
                <td>{shipment.weightKg} kg</td>
                <td>
                  <span className={`status-pill status-${shipment.status.toLowerCase()}`}>
                    {shipment.status}
                  </span>
                </td>
                <td>
                  <Link className="link-btn" to={`/shipments/${shipment.id}`}>
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
