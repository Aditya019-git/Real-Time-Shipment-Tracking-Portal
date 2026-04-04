# Shipment API Contract (Frontend Sync)

## Status Enum (freeze)
- `POSTED`
- `AWARDED`
- `AWAITING_PICKUP`
- `IN_TRANSIT`
- `DELIVERED`

## Shipment Object Shape
```json
{
  "id": "SHP-1001",
  "origin": "Bengaluru",
  "destination": "Hyderabad",
  "weightKg": 1800,
  "status": "IN_TRANSIT",
  "eta": "Apr 3, 2026 18:30 IST",
  "lastLocation": {
    "latitude": 14.4426,
    "longitude": 78.8242
  },
  "statusTimeline": [
    {
      "status": "POSTED",
      "timestamp": "Apr 1, 2026 09:00 IST"
    }
  ]
}
```

## Endpoints Needed by Frontend
- `GET /api/shipments`
  - supports returning either:
    - raw array of shipments, or
    - `{ "items": [ ... ] }`, or
    - `{ "data": [ ... ] }`
- `GET /api/shipments/{id}`
  - returns one shipment object

## Notes
- `status` must always be one of the enum values above.
- `id`, `origin`, `destination`, `status` are required.
- `lastLocation` and `statusTimeline` should always be present for detail view.
