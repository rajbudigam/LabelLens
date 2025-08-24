"use client";

import { useState, useEffect } from 'react';
import Badge from '@/components/Badge';
import NovaGauge from '@/components/NovaGauge';
import type { Analysis } from '@/lib/store/types';

export default function SavedPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  // Load saved analyses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('saved-analyses');
    if (saved) {
      try {
        setAnalyses(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved analyses:', error);
      }
    }
  }, []);

  // Apply filters and sorting
  const filteredAnalyses = analyses
    .filter(analysis => {
      // Apply search filter
      if (searchTerm) {
        return analysis.inputText.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    })
    .filter(analysis => {
      // Apply starred filter
      if (showStarredOnly) {
        return (analysis as any).starred;
      }
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return b.score - a.score;
      }
    });

  const deleteAnalysis = (id: string) => {
    const updated = analyses.filter(a => a.id !== id);
    setAnalyses(updated);
    localStorage.setItem('saved-analyses', JSON.stringify(updated));
  };

  const toggleStar = (id: string) => {
    const updated = analyses.map(a => 
      a.id === id ? { ...a, starred: !(a as any).starred } as Analysis : a
    );
    setAnalyses(updated);
    localStorage.setItem('saved-analyses', JSON.stringify(updated));
  };

  return (
    <main className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Saved Analyses</h1>
          <p className="text-slate-400">
            {analyses.length} saved • {filteredAnalyses.length} showing
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-800 rounded-lg p-4 space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search analyses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 rounded border border-slate-600 text-white placeholder-slate-400"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'score')}
            className="px-3 py-2 bg-slate-700 rounded border border-slate-600 text-white"
          >
            <option value="date">Sort by Date</option>
            <option value="score">Sort by Score</option>
          </select>
          <label className="flex items-center gap-2 text-slate-300">
            <input
              type="checkbox"
              checked={showStarredOnly}
              onChange={(e) => setShowStarredOnly(e.target.checked)}
              className="rounded"
            />
            Starred only
          </label>
        </div>
      </div>

      {/* Results */}
      {filteredAnalyses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            {analyses.length === 0 ? 'No analyses saved yet' : 'No analyses match your filters'}
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded"
          >
            Start Analysis
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAnalyses.map((analysis) => (
            <div key={analysis.id} className="bg-slate-800 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="text-slate-300 text-sm mb-2">
                    {new Date(analysis.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-white text-sm leading-relaxed">
                    {analysis.inputText.length > 200 
                      ? `${analysis.inputText.substring(0, 200)}...` 
                      : analysis.inputText
                    }
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => toggleStar(analysis.id)}
                    className={`p-2 rounded ${
                      (analysis as any).starred 
                        ? 'text-yellow-400 hover:text-yellow-300' 
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    ⭐
                  </button>
                  <button
                    onClick={() => deleteAnalysis(analysis.id)}
                    className="p-2 text-red-400 hover:text-red-300 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Analysis Summary */}
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-1">
                  <NovaGauge nova={{...analysis.nova, note: `Group ${analysis.nova.group}`}} score={analysis.score} />
                </div>
                <div className="md:col-span-3">
                  <div className="space-y-3">
                    {/* Additives */}
                    {analysis.additives.length > 0 && (
                      <div>
                        <h4 className="font-medium text-white mb-2">Additives</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.additives.slice(0, 5).map((additive, index) => (
                            <Badge 
                              key={index} 
                              text={additive.name} 
                              tone={additive.severity === 'high' ? 'danger' : additive.severity === 'medium' ? 'warn' : 'ok'} 
                            />
                          ))}
                          {analysis.additives.length > 5 && (
                            <Badge text={`+${analysis.additives.length - 5} more`} tone="warn" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Allergens */}
                    {analysis.allergens.length > 0 && (
                      <div>
                        <h4 className="font-medium text-white mb-2">Allergens</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.allergens.map((allergen, index) => (
                            <Badge key={index} text={allergen.name} tone="danger" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => window.location.href = `/results?q=${encodeURIComponent(analysis.inputText)}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm"
                >
                  View Full Results
                </button>
                <button
                  onClick={() => window.open(`/report?q=${encodeURIComponent(analysis.inputText)}`, '_blank')}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm border border-slate-600"
                >
                  Export PDF
                </button>
                <button
                  onClick={() => window.location.href = `/compare?a=${encodeURIComponent(analysis.inputText)}`}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm border border-slate-600"
                >
                  Compare
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
