# Minimal MES Skeleton

Dieses Repository enthält ein kleines, in TypeScript geschriebenes Grundgerüst für ein Manufacturing Execution System (MES). Aufgrund eingeschränkter Umgebung wurden keine externen Pakete verwendet. Das Projekt demonstriert:

- Generierung eindeutiger Auftragsnummern (`ORD-YYYY-####`).
- Ein einfacher HTTP-Server mit zwei Endpunkten:
  - `GET /api/orders` – listet alle Aufträge im Speicher.
  - `POST /api/orders` – legt einen neuen Auftrag an (erfordert `customerId`).
- Typdefinitionen für zentrale Domänenobjekte.
- Unit-Test für den Auftragsnummern-Generator.

## Nutzung

```bash
npm test        # Kompiliert TypeScript und führt den Test aus
npm start       # Startet den HTTP-Server auf Port 3000
```

Der Server speichert Daten nur im Arbeitsspeicher und dient als Ausgangspunkt für weitere Erweiterungen (z. B. Datenbank, Authentifizierung, Frontend).
