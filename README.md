# Minimal MES Skeleton

Dieses Repository enthält ein kleines, in TypeScript geschriebenes Grundgerüst für ein Manufacturing Execution System (MES). Aufgrund eingeschränkter Umgebung wurden keine externen Pakete verwendet. Das Projekt demonstriert:

- Generierung eindeutiger Auftragsnummern (`ORD-YYYY-####`).
- Verwaltung einfacher Kunden- und Auftragsdaten im Speicher.
- HTTP-API mit folgenden Endpunkten:
  - `GET /api/customers`, `POST /api/customers` – Kunden anlegen und auflisten.
  - `GET /api/orders` – Aufträge auflisten (Filter: `status`, `customerId`).
  - `POST /api/orders` – neuen Auftrag anlegen (erfordert `customerId`).
  - `GET /api/orders/:id` – Auftragsdetails.
  - `PATCH /api/orders/:id` – Statusänderung mit Audit-Log.
  - `GET /api/orders/:id/logs` – protokollierte Statuswechsel.
- Typdefinitionen für zentrale Domänenobjekte.
- Unit-Tests für Auftragsnummern-Generator und API-Grundfunktionen.

## Nutzung

```bash
npm test        # Kompiliert TypeScript und führt den Test aus
npm start       # Startet den HTTP-Server auf Port 3000
```

Der Server speichert Daten nur im Arbeitsspeicher und dient als Ausgangspunkt für weitere Erweiterungen (z. B. Datenbank, Authentifizierung, Frontend).
