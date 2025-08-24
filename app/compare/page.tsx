'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import TextArea from '@/components/TextArea';
import AnalyzeButton from '@/components/AnalyzeButton';
import NovaGauge from '@/components/NovaGauge';
import AllergenPanel from '@/components/AllergenPanel';
import RuleHitList from '@/components/RuleHitList';
import JurisdictionTable from '@/components/JurisdictionTable';
import Badge from '@/components/Badge';
import { analyzeIngredients } from '@/lib/classify/score';
import { storage } from '@/lib/store/storage';
import type { Analysis, ComparisonScenario } from '@/lib/store/types';

export default function ComparePage() {
  const searchParams = useSearchParams();
  const [productA, setProductA] = useState('');
  const [productB, setProductB] = useState('');
  const [analysisA, setAnalysisA] = useState<Analysis | null>(null);
  const [analysisB, setAnalysisB] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
    const [showSaved, setShowSaved] = useState<'A' | 'B' | false>(false);
  const [savedAnalyses, setSavedAnalyses] = useState<Analysis[]>([]);

  // Load saved analyses
  useEffect(() => {
    const loadSaved = async () => {
      const saved = await storage.getSavedAnalyses();
      setSavedAnalyses(saved);
    };
    loadSaved();
  }, []);

  // Load from URL params
  useEffect(() => {
    const a = searchParams.get('a');
    const b = searchParams.get('b');
    if (a) setProductA(decodeURIComponent(a));
    if (b) setProductB(decodeURIComponent(b));
  }, [searchParams]);

  const handleAnalyze = async () => {
    if (!productA.trim() || !productB.trim()) return;

    setLoading(true);
    try {
      const [resultA, resultB] = await Promise.all([
        analyzeIngredients(productA),
        analyzeIngredients(productB)
      ]);

      setAnalysisA(resultA);
      setAnalysisB(resultB);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    setProductA(productB);
    setProductB(productA);
    setAnalysisA(analysisB);
    setAnalysisB(analysisA);
  };

  const handleSaveComparison = async () => {
    if (!analysisA || !analysisB) return;

    const comparison: ComparisonScenario = {
      id: `comp_${Date.now()}`,
      analysisA,
      analysisB,
      createdAt: new Date().toISOString(),
      title: `Comparison ${new Date().toLocaleDateString()}`
    };

    await storage.saveComparison(comparison);
    
    // Show success toast
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg z-50';
    toast.textContent = 'Comparison saved!';
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  };

  const handleLoadSaved = (analysis: Analysis, target: 'A' | 'B') => {
    if (target === 'A') {
      setProductA(analysis.inputText);
      setAnalysisA(analysis);
    } else {
      setProductB(analysis.inputText);
      setAnalysisB(analysis);
    }
    setShowSaved(false);
  };

  const getDeltaAnalysis = () => {
    if (!analysisA || !analysisB) return null;

    const deltaAddives = analysisB.additives.length - analysisA.additives.length;
    const deltaAllergens = analysisB.allergens.length - analysisA.allergens.length;
    const deltaScore = analysisB.score - analysisA.score;
    const deltaNovaGroup = analysisB.nova.group - analysisA.nova.group;

    const winner = analysisB.score < analysisA.score ? 'B' : 'A';
    const cleaner = winner === 'B' ? analysisB : analysisA;

    return {
      deltaAddives,
      deltaAllergens,
      deltaScore,
      deltaNovaGroup,
      winner,
      cleaner,
      summary: `Product ${winner} has ${Math.abs(deltaAddives)} ${deltaAddives < 0 ? 'fewer' : 'more'} additives and ${Math.abs(deltaScore)} ${deltaScore < 0 ? 'lower' : 'higher'} overall score.`
    };
  };

  const delta = getDeltaAnalysis();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Product Comparison</h1>
        <p className="text-slate-400">
          Compare two products side-by-side to see differences in additives, allergens, 
          and regulatory compliance. Identify the cleaner option with transparent analysis.
        </p>
      </div>

      {/* Input Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Product A</h2>
            <button
              onClick={() => setShowSaved(showSaved === 'A' ? false : 'A')}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Load Saved
            </button>
          </div>
          <TextArea
            value={productA}
            onChange={setProductA}
            placeholder="Enter ingredients for Product A..."
            rows={4}
          />
          {showSaved === 'A' && (
            <div className="mt-4 max-h-40 overflow-y-auto bg-slate-700 rounded p-4">
              {savedAnalyses.map((analysis) => (
                <button
                  key={analysis.id}
                  onClick={() => handleLoadSaved(analysis, 'A')}
                  className="block w-full text-left p-2 hover:bg-slate-600 rounded text-sm"
                >
                  <div className="text-white font-medium">{analysis.title || 'Untitled'}</div>
                  <div className="text-slate-300 text-xs truncate">{analysis.inputText}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Product B</h2>
            <button
              onClick={() => setShowSaved(showSaved === 'B' ? false : 'B')}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Load Saved
            </button>
          </div>
          <TextArea
            value={productB}
            onChange={setProductB}
            placeholder="Enter ingredients for Product B..."
            rows={4}
          />
          {showSaved === 'B' && (
            <div className="mt-4 max-h-40 overflow-y-auto bg-slate-700 rounded p-4">
              {savedAnalyses.map((analysis) => (
                <button
                  key={analysis.id}
                  onClick={() => handleLoadSaved(analysis, 'B')}
                  className="block w-full text-left p-2 hover:bg-slate-600 rounded text-sm"
                >
                  <div className="text-white font-medium">{analysis.title || 'Untitled'}</div>
                  <div className="text-slate-300 text-xs truncate">{analysis.inputText}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={handleAnalyze}
          disabled={!productA.trim() || !productB.trim() || loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          {loading ? 'Analyzing...' : 'Compare Products'}
        </button>        <button
          onClick={handleSwap}
          disabled={!productA || !productB}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          ↔ Swap Sides
        </button>

        {analysisA && analysisB && (
          <button
            onClick={handleSaveComparison}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            💾 Save Comparison
          </button>
        )}
      </div>

      {/* Delta Analysis */}
      {delta && (
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Comparison Results</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className={`text-2xl font-bold mb-2 ${delta.winner === 'A' ? 'text-green-400' : 'text-slate-400'}`}>
                Product A
              </div>
              <div className="text-sm text-slate-300">
                {analysisA?.additives.length} additives • NOVA {analysisA?.nova.group}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-white mb-2">
                {delta.winner === 'A' ? '← Winner' : delta.winner === 'B' ? 'Winner →' : 'Tie'}
              </div>
              <div className="text-sm text-slate-400">
                {delta.summary}
              </div>
            </div>

            <div className="text-center">
              <div className={`text-2xl font-bold mb-2 ${delta.winner === 'B' ? 'text-green-400' : 'text-slate-400'}`}>
                Product B
              </div>
              <div className="text-sm text-slate-300">
                {analysisB?.additives.length} additives • NOVA {analysisB?.nova.group}
              </div>
            </div>
          </div>

          {/* Delta Details */}
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="bg-slate-700 rounded p-3 text-center">
              <div className="text-slate-400">Additive Difference</div>
              <div className={`font-bold ${delta.deltaAddives > 0 ? 'text-red-400' : delta.deltaAddives < 0 ? 'text-green-400' : 'text-slate-300'}`}>
                {delta.deltaAddives > 0 ? '+' : ''}{delta.deltaAddives}
              </div>
            </div>
            <div className="bg-slate-700 rounded p-3 text-center">
              <div className="text-slate-400">NOVA Difference</div>
              <div className={`font-bold ${delta.deltaNovaGroup > 0 ? 'text-red-400' : delta.deltaNovaGroup < 0 ? 'text-green-400' : 'text-slate-300'}`}>
                {delta.deltaNovaGroup > 0 ? '+' : ''}{delta.deltaNovaGroup}
              </div>
            </div>
            <div className="bg-slate-700 rounded p-3 text-center">
              <div className="text-slate-400">Allergen Difference</div>
              <div className={`font-bold ${delta.deltaAllergens > 0 ? 'text-red-400' : delta.deltaAllergens < 0 ? 'text-green-400' : 'text-slate-300'}`}>
                {delta.deltaAllergens > 0 ? '+' : ''}{delta.deltaAllergens}
              </div>
            </div>
            <div className="bg-slate-700 rounded p-3 text-center">
              <div className="text-slate-400">Score Difference</div>
              <div className={`font-bold ${delta.deltaScore > 0 ? 'text-red-400' : delta.deltaScore < 0 ? 'text-green-400' : 'text-slate-300'}`}>
                {delta.deltaScore > 0 ? '+' : ''}{delta.deltaScore.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-side Analysis Results */}
      {analysisA && analysisB && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product A Results */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold text-white" id="product-a-results">Product A Results</h2>
              {delta?.winner === 'A' && <Badge text="Winner" tone="ok" />}
            </div>
            
            <NovaGauge
              nova={{...analysisA.nova, note: `NOVA ${analysisA.nova.group}`}}
              score={analysisA.score}
              aria-labelledby="nova-a"
            />            <AllergenPanel hits={analysisA.allergens.map(allergen => ({
              key: allergen.name,
              display: allergen.name,
              aliases: [allergen.name]
            }))} />
            
            <RuleHitList 
              hits={analysisA.additives.map(additive => ({
                key: additive.name,
                display: additive.name,
                aliases: additive.aliases,
                severity: additive.severity === 'medium' ? 'med' : additive.severity,
                category: additive.category || 'Unknown',
                us: additive.jurisdictionStatus?.US?.banned ? 'Banned' : 'Allowed',
                ca: additive.jurisdictionStatus?.CA?.banned ? 'Banned' : 'Allowed',
                eu: additive.jurisdictionStatus?.EU?.banned ? 'Banned' : 'Allowed',
                explainer: additive.description,
                refUrl: additive.references?.[0]
              }))}
            />
            
            <JurisdictionTable rows={analysisA.jurisdictions.map(jurisdiction => ({
              key: jurisdiction.region,
              display: jurisdiction.region,
              us: jurisdiction.region === 'US' ? (jurisdiction.status.banned ? 'Banned' : 'Allowed') : 'N/A',
              ca: jurisdiction.region === 'CA' ? (jurisdiction.status.banned ? 'Banned' : 'Allowed') : 'N/A',
              eu: jurisdiction.region === 'EU' ? (jurisdiction.status.banned ? 'Banned' : 'Allowed') : 'N/A'
            }))} />
          </div>

          {/* Product B Results */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold text-white" id="product-b-results">Product B Results</h2>
              {delta?.winner === 'B' && <Badge text="Winner" tone="ok" />}
            </div>
            
            <NovaGauge 
              nova={{...analysisB.nova, note: `NOVA ${analysisB.nova.group}`}}
              score={analysisB.score}
              aria-labelledby="product-b-results"
            />
            
            <AllergenPanel hits={analysisB.allergens.map(allergen => ({
              key: allergen.name,
              display: allergen.name,
              aliases: [allergen.name]
            }))} />
            
            <RuleHitList 
              hits={analysisB.additives.map(additive => ({
                key: additive.name,
                display: additive.name,
                aliases: additive.aliases,
                severity: additive.severity === 'medium' ? 'med' : additive.severity,
                category: additive.category || 'Unknown',
                us: additive.jurisdictionStatus?.US?.banned ? 'Banned' : 'Allowed',
                ca: additive.jurisdictionStatus?.CA?.banned ? 'Banned' : 'Allowed',
                eu: additive.jurisdictionStatus?.EU?.banned ? 'Banned' : 'Allowed',
                explainer: additive.description,
                refUrl: additive.references?.[0]
              }))}
            />
            
            <JurisdictionTable rows={analysisB.jurisdictions.map(jurisdiction => ({
              key: jurisdiction.region,
              display: jurisdiction.region,
              us: jurisdiction.region === 'US' ? (jurisdiction.status.banned ? 'Banned' : 'Allowed') : 'N/A',
              ca: jurisdiction.region === 'CA' ? (jurisdiction.status.banned ? 'Banned' : 'Allowed') : 'N/A',
              eu: jurisdiction.region === 'EU' ? (jurisdiction.status.banned ? 'Banned' : 'Allowed') : 'N/A'
            }))} />
          </div>
        </div>
      )}

      {/* Export Options */}
      {analysisA && analysisB && (
        <div className="mt-8 bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Export & Share</h3>
          <div className="flex gap-4">
            <Link
              href={`/report?comparison=true&a=${encodeURIComponent(productA)}&b=${encodeURIComponent(productB)}`}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              📄 Export Comparative PDF
            </Link>
            <button
              onClick={() => {
                const url = `${window.location.origin}/compare?a=${encodeURIComponent(productA)}&b=${encodeURIComponent(productB)}`;
                navigator.clipboard.writeText(url);
                // Show copied toast
                const toast = document.createElement('div');
                toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg z-50';
                toast.textContent = 'Link copied!';
                document.body.appendChild(toast);
                setTimeout(() => document.body.removeChild(toast), 3000);
              }}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              🔗 Share Comparison Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
