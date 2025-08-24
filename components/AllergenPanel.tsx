import Badge from "./Badge";
import { AllergenHit } from "@/lib/types";

export default function AllergenPanel({ hits }:{ hits: AllergenHit[] }) {
  return (
    <div className="p-4 rounded-lg border border-slate-800 bg-slate-900 h-full">
      <h3 className="font-semibold mb-2">Allergens (US Big-9)</h3>
      {hits.length===0 ? <p className="text-slate-300">None detected.</p> :
        <div className="flex gap-2 flex-wrap">
          {hits.map(h => <Badge key={h.key} text={h.display} tone="danger" />)}
        </div>}
      <p className="text-xs text-slate-400 mt-2">Always verify label warnings (&quot;may contain&quot;, &quot;processed in a facility with…&quot;).</p>
    </div>
  );
}
