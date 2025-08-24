import { AllergenHit } from "@/lib/types";
import { ALLERGENS } from "@/lib/rules/allergens";

export function classifyAllergens(tokens: string[]): { hits: AllergenHit[] } {
  const text = tokens.join(" ");
  const hits: AllergenHit[] = [];
  for (const a of ALLERGENS) {
    if (a.aliases.some(alias => new RegExp(`\\b${alias.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")}\\b`, "i").test(text))) {
      hits.push({ ...a });
    }
  }
  // de-duplicate by key
  const uniq = new Map(hits.map(h => [h.key, h]));
  return { hits: Array.from(uniq.values()) };
}
