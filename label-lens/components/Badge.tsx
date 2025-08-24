export default function Badge({ text, tone }:{ text:string; tone:"ok"|"warn"|"danger" }) {
  const cls = tone==="ok" ? "bg-emerald-600/20 text-emerald-300 border-emerald-700/40"
    : tone==="warn" ? "bg-amber-600/20 text-amber-300 border-amber-700/40"
    : "bg-red-600/20 text-red-300 border-red-700/40";
  return <span className={`inline-block text-xs px-2 py-1 rounded-md border ${cls}`}>{text}</span>;
}
