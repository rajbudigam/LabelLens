import Badge from "./Badge";

export default function NovaGauge({ nova, score }:{ nova:{ group:number; note:string; markers:string[] }; score:number; }) {
  const bars = [1,2,3,4];
  return (
    <div className="p-4 rounded-lg border border-slate-800 bg-slate-900 h-full">
      <h3 className="font-semibold mb-2">NOVA Estimate</h3>
      <div className="flex gap-2 mb-2">
        {bars.map(b=>(
          <div key={b} className={`h-4 flex-1 rounded ${b<=nova.group ? "bg-blue-500" : "bg-slate-700"}`} />
        ))}
      </div>
      <p className="text-sm text-slate-300">Group {nova.group}: {nova.note}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {nova.markers.map(m => <Badge key={m} text={m} tone="warn" />)}
      </div>
      <p className="text-xs text-slate-400 mt-2">Heuristic estimate; for transparency only.</p>
      <div className="mt-3"><Badge text={`Clean-label score: ${score}/100`} tone={score>=70?"ok":score>=40?"warn":"danger"} /></div>
    </div>
  );
}
