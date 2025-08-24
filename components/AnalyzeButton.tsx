"use client";

export default function AnalyzeButton({ onClick, disabled }:{ onClick:()=>void; disabled?:boolean; }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg transition-colors font-medium">
      Analyze Ingredients
    </button>
  );
}
