"use client";

export default function AnalyzeButton({ onClick, disabled }:{ onClick:()=>void; disabled?:boolean; }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="no-print inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50">
      Analyze
    </button>
  );
}
