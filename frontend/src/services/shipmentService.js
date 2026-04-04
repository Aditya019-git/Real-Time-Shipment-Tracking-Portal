import { mockShipments } from "../mocks/shipments";
import { httpClient } from "./httpClient";

function normalizeShipmentResponse(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
}

export async function getShipments() {
  try {
    const response = await httpClient.get("/shipments");
    const apiShipments = normalizeShipmentResponse(response.data);
    return apiShipments.length > 0 ? apiShipments : mockShipments;
  } catch {
    return mockShipments;
  }
}

export async function getShipmentById(id) {
  try {
    const response = await httpClient.get(`/shipments/${id}`);
    return response.data;
  } catch {
    const fallback = mockShipments.find((shipment) => shipment.id === id);
    if (!fallback) {
      throw new Error("Shipment not found.");
    }
    return fallback;
  }
}
