import { AdditiveHit } from "@/lib/types";

export function overallScore({ additives, allergens, nova }:{
  additives: { hits: AdditiveHit[] },
  allergens: { hits: { key:string }[] },
  nova: { group: 1|2|3|4 }
}): number {
  let score = 100;
  // Penalize by NOVA group
  score -= (nova.group-1) * 12;
  // Penalize additives by severity
  for (const h of additives.hits) {
    score -= h.severity==="high" ? 15 : h.severity==="med" ? 8 : 4;
  }
  // Allergens reduce score slightly (presence ≠ bad, but caution)
  score -= Math.min(12, allergens.hits.length * 2);
  return Math.max(0, Math.min(100, score));
}
