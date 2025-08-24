import { NOVA_MARKERS } from "@/lib/rules/nova_markers";

export function novaEstimate(tokens: string[]): { group: 1|2|3|4; note: string; markers: string[] } {
  const text = tokens.join(" ");
  let score = 0;
  const markers: string[] = [];
  for (const m of NOVA_MARKERS) {
    if (new RegExp(`\\b${m.term.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")}\\b`, "i").test(text)) {
      score += m.weight;
      markers.push(m.term);
    }
  }
  // crude mapping: 0-1 -> 1; 2-3 -> 2; 4-5 -> 3; >=6 -> 4
  const group = (score >= 6) ? 4 : (score >= 4) ? 3 : (score >= 2) ? 2 : 1;
  const note = group===1 ? "Unprocessed or minimally processed markers"
    : group===2 ? "Processed culinary ingredients and limited additives"
    : group===3 ? "Processed foods showing several markers"
    : "Likely ultra-processed (multiple additive markers)";
  return { group: group as 1|2|3|4, note, markers };
}
