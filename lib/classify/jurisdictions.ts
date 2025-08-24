import { AdditiveHit, JurisdictionRow } from "@/lib/types";

export function buildJurisdictionRows(additives: { hits: AdditiveHit[] }): JurisdictionRow[] {
  return additives.hits.map(h => ({
    key: h.key, display: h.display, us: h.us, ca: h.ca, eu: h.eu
  }));
}
