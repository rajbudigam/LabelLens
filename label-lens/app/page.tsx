"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TextArea from "@/components/TextArea";
import AnalyzeButton from "@/components/AnalyzeButton";

const samples = [
  "Corn syrup, sugar, gelatin, artificial flavor, Red 3 (erythrosine), citric acid.",
  "Enriched wheat flour (wheat flour, niacin, reduced iron, thiamine mononitrate, riboflavin, folic acid), vegetable oil (palm), salt, maltodextrin, mono- and diglycerides, natural flavors.",
  "Cultured pasteurized grade A milk, strawberries, cane sugar, pectin.",
  "Carbonated water, brominated vegetable oil, natural flavor, caffeine."
];

export default function Home() {
  const [text, setText] = useState("");
  const router = useRouter();

  const run = () => {
    const q = encodeURIComponent(text.trim());
    if (q.length === 0) return;
    router.push(`/results?q=${q}`);
  };

  const setSample = (i: number) => setText(samples[i]);

  return (
    <main className="space-y-6">
      <header className="no-print">
        <h1 className="text-3xl font-semibold">LabelLens</h1>
        <p className="text-slate-400 mt-1">
          Paste an ingredient list → get additive flags, allergen scan (US Big-9 incl. sesame),
          and a NOVA-style ultra-processing estimate. All client-side.
        </p>
      </header>

      <div className="no-print flex gap-2 flex-wrap">
        {samples.map((_, i) => (
          <button key={i} onClick={() => setSample(i)}
            className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-sm border border-slate-700">
            Try sample {i + 1}
          </button>
        ))}
      </div>

      <TextArea value={text} onChange={setText} placeholder="Paste ingredients here…" rows={10} />
      <AnalyzeButton onClick={run} disabled={!text.trim()} />
    </main>
  );
}
