"use client";

import { CsvDownloadButton } from "../components/CsvDownloadButton";
import { exportAllEventsCsv } from "../actions";

export function AllEventsCsvButton() {
  return (
    <CsvDownloadButton
      fetchCsv={() => exportAllEventsCsv()}
      filename="all_events_summary.csv"
      label="Export Events CSV"
    />
  );
}
