"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { tokenize } from "@/lib/parse/tokenize";
import { canonicalize } from "@/lib/parse/canonicalize";
import { classifyAdditives } from "@/lib/classify/additives";
import { classifyAllergens } from "@/lib/classify/allergens";
import { novaEstimate } from "@/lib/classify/nova";
import { buildJurisdictionRows } from "@/lib/classify/jurisdictions";

function ReportContent() {
  const sp = useSearchParams();
  const ingredients = decodeURIComponent(sp.get("q") || "");

  const toks = tokenize(ingredients);
  const c = canonicalize(toks);
  const additives = classifyAdditives(c);
  const allergens = classifyAllergens(c);
  const nova = novaEstimate(c);
  const jrows = buildJurisdictionRows(additives);

  return (
    <main className="space-y-4 print:block">
      <h1 className="text-2xl font-semibold">LabelLens — Analysis Report</h1>
      <p className="text-slate-400">Inputs: {ingredients}</p>

      <h2 className="font-semibold mt-4">NOVA Estimate</h2>
      <p>Group {nova.group} — {nova.note}</p>

      <h2 className="font-semibold mt-4">Allergens (US Big-9)</h2>
      <ul className="list-disc ml-6">
        {allergens.hits.length===0 ? <li>None detected</li> :
          allergens.hits.map(a => <li key={a.key}>{a.display}</li>)}
      </ul>

      <h2 className="font-semibold mt-4">Additive Flags</h2>
      <ul className="list-disc ml-6">
        {additives.hits.length===0 ? <li>No flagged additives</li> :
          additives.hits.map(h => <li key={h.key}>{h.display} — {h.severity.toUpperCase()}</li>)}
      </ul>

      <h2 className="font-semibold mt-4">Jurisdiction Status</h2>
      <table className="w-full text-sm border border-slate-700">
        <thead>
          <tr className="bg-slate-800">
            <th className="p-2 text-left">Additive</th>
            <th className="p-2 text-left">US (FDA)</th>
            <th className="p-2 text-left">California AB418</th>
            <th className="p-2 text-left">EU</th>
          </tr>
        </thead>
        <tbody>
          {jrows.length===0 ? <tr><td className="p-2" colSpan={4}>No flagged additives</td></tr> :
            jrows.map(r => (
              <tr key={r.key} className="border-t border-slate-800">
                <td className="p-2">{r.display}</td>
                <td className="p-2">{r.us}</td>
                <td className="p-2">{r.ca}</td>
                <td className="p-2">{r.eu}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="no-print mt-4">
        <button onClick={()=>window.print()} className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500">
          Print / Save as PDF
        </button>
      </div>

      <p className="text-xs text-slate-400 mt-6">
        Disclaimer: NOVA is an estimate based on markers (emulsifiers, flavors, colorants, etc.). Legal
        statuses reflect summarized public sources and may change. This tool is for educational purposes.
      </p>
    </main>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportContent />
    </Suspense>
  );
}
