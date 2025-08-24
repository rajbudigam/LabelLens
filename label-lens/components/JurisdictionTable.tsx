import { JurisdictionRow } from "@/lib/types";

export default function JurisdictionTable({ rows }:{ rows: JurisdictionRow[] }) {
  if (rows.length===0) return null;
  return (
    <section className="p-4 rounded-lg border border-slate-800 bg-slate-900">
      <h3 className="font-semibold mb-3">Jurisdiction Status</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-800">
              <th className="text-left p-2">Additive</th>
              <th className="text-left p-2">US (FDA)</th>
              <th className="text-left p-2">California AB 418</th>
              <th className="text-left p-2">EU</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.key} className="border-t border-slate-800">
                <td className="p-2">{r.display}</td>
                <td className="p-2">{r.us}</td>
                <td className="p-2">{r.ca}</td>
                <td className="p-2">{r.eu}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 mt-2">Summaries only; consult official sources for details.</p>
    </section>
  );
}
