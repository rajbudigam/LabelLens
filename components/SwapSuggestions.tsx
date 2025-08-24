import { suggestSwaps } from "@/lib/rules/swaps";

export default function SwapSuggestions({ tokens }:{ tokens:string[] }) {
  const suggestions = suggestSwaps(tokens);
  if (suggestions.length===0) return null;
  return (
    <section className="p-4 rounded-lg border border-slate-800 bg-slate-900">
      <h3 className="font-semibold mb-2">Possible cleaner swaps</h3>
      <ul className="list-disc ml-6">
        {suggestions.map((s,i)=><li key={i} className="text-slate-300">{s}</li>)}
      </ul>
      <p className="text-xs text-slate-400 mt-2">Based on similar products with fewer additive markers.</p>
    </section>
  );
}
