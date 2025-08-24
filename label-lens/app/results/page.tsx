"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AllergenPanel from "@/components/AllergenPanel";
import NovaGauge from "@/components/NovaGauge";
import RuleHitList from "@/components/RuleHitList";
import JurisdictionTable from "@/components/JurisdictionTable";
import SwapSuggestions from "@/components/SwapSuggestions";
import { tokenize } from "@/lib/parse/tokenize";
import { canonicalize } from "@/lib/parse/canonicalize";
import { classifyAdditives } from "@/lib/classify/additives";
import { classifyAllergens } from "@/lib/classify/allergens";
import { novaEstimate } from "@/lib/classify/nova";
import { buildJurisdictionRows } from "@/lib/classify/jurisdictions";
import { overallScore } from "@/lib/classify/score";

function ResultsContent() {
  const sp = useSearchParams();
  const router = useRouter();
  const q = sp.get("q") || "";
  const ingredients = decodeURIComponent(q);

  const [ready, setReady] = useState(false);

  const result = useMemo(() => {
    const toks = tokenize(ingredients);
    const c = canonicalize(toks);
    const additives = classifyAdditives(c);
    const allergens = classifyAllergens(c);
    const nova = novaEstimate(c);
    const jrows = buildJurisdictionRows(additives);
    const score = overallScore({ additives, allergens, nova });
    return { c, additives, allergens, nova, jrows, score };
  }, [ingredients]);

  useEffect(() => setReady(true), []);

  if (!ingredients) {
    return (
      <main className="space-y-4">
        <p>No ingredients found. Go back and paste a list.</p>
        <button className="px-3 py-1 rounded-md bg-slate-800 border border-slate-700"
          onClick={() => router.push("/")}>← Home</button>
      </main>
    );
  }

  return (
    <main className="space-y-6">
      <div className="no-print flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Results</h1>
          <p className="text-slate-400">{ingredients.slice(0, 180)}{ingredients.length > 180 ? "…" : ""}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>window.open(`/report?q=${encodeURIComponent(ingredients)}`,"_blank")}
            className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500">Export PDF</button>
          <button onClick={()=>router.push("/")}
            className="px-3 py-2 rounded-md bg-slate-800 border border-slate-700">New</button>
        </div>
      </div>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1"><NovaGauge nova={result.nova} score={result.score} /></div>
        <div className="md:col-span-2"><AllergenPanel hits={result.allergens.hits} /></div>
      </section>

      <RuleHitList hits={result.additives.hits} />
      <JurisdictionTable rows={result.jrows} />

      <SwapSuggestions tokens={result.c} />
      {!ready && <p className="text-slate-400">Loading…</p>}
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
