import { AdditiveHit } from "@/lib/types";
import { listAdditives } from "@/lib/rules/additives";

export function classifyAdditives(tokens: string[]): { hits: AdditiveHit[] } {
  const rules = listAdditives();
  const joined = tokens.join(" ");
  const hits: AdditiveHit[] = [];
  for (const r of rules) {
    if (r.aliases.some(a => new RegExp(`\\b${a.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&")}\\b`, "i").test(joined))) {
      hits.push({ ...r });
    }
  }
  return { hits };
}
