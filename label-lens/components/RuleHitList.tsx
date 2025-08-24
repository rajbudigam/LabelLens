import { AdditiveHit } from "@/lib/types";
import Badge from "./Badge";

export default function RuleHitList({ hits }:{ hits:AdditiveHit[] }) {
  return (
    <section className="p-4 rounded-lg border border-slate-800 bg-slate-900">
      <h3 className="font-semibold mb-3">Additive Flags</h3>
      {hits.length===0 ? <p className="text-slate-300">No flagged additives detected.</p> :
        <ul className="space-y-3">
          {hits.map(h=>(
            <li key={h.key} className="border border-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{h.display}</div>
                <Badge text={h.severity.toUpperCase()} tone={h.severity==="high"?"danger":h.severity==="med"?"warn":"ok"} />
              </div>
              <p className="text-sm text-slate-300 mt-1">{h.explainer}</p>
              {h.refUrl && <a className="text-xs text-blue-400" href={h.refUrl} target="_blank">Reference</a>}
            </li>
          ))}
        </ul>}
    </section>
  );
}
