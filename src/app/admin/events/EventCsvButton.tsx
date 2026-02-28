"use client";

import { CsvDownloadButton } from "../components/CsvDownloadButton";
import { exportEventRegistrationsCsv } from "../actions";

export function EventCsvButton({
  eventId,
  eventName,
}: {
  eventId: string;
  eventName: string;
}) {
  const safeName = eventName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  return (
    <CsvDownloadButton
      fetchCsv={() => exportEventRegistrationsCsv(eventId)}
      filename={`event_${safeName}_registrations.csv`}
      label="Export CSV"
    />
  );
}
