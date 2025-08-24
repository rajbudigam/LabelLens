"use client";

export default function TextArea({
  value, onChange, placeholder, rows = 10,
}: { value: string; onChange: (v:string)=>void; placeholder?: string; rows?: number; }) {
  return (
    <textarea
      className="w-full rounded-lg bg-slate-900 border border-slate-800 p-3 outline-none focus:ring-2 focus:ring-blue-600 text-white placeholder-slate-400 resize-none"
      placeholder={placeholder}
      rows={rows}
      value={value}
      onChange={(e)=>onChange(e.target.value)}
    />
  );
}
