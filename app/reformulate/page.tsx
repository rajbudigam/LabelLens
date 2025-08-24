'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Badge from '@/components/Badge';
import NovaGauge from '@/components/NovaGauge';
import { analyzeIngredients } from '@/lib/classify/score';
import type { Analysis } from '@/lib/store/types';

export default function ReformulatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [originalText, setOriginalText] = useState('');
  const [originalAnalysis, setOriginalAnalysis] = useState<Analysis | null>(null);
  const [modifiedAnalysis, setModifiedAnalysis] = useState<Analysis | null>(null);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [presetScenarios, setPresetScenarios] = useState<any[]>([]);

  // Load initial data from URL or provide sample
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setOriginalText(decodeURIComponent(q));
    } else {
      // Default sample with problematic additives
      setOriginalText('Enriched wheat flour, sugar, palm oil, cocoa powder, high fructose corn syrup, salt, baking soda, soy lecithin, red 3, yellow 5, brominated vegetable oil, potassium bromate, artificial vanilla flavor, preservatives (BHT, BHA)');
    }
  }, [searchParams]);

  // Analyze original when text changes
  useEffect(() => {
    if (originalText) {
      analyzeOriginal();
    }
  }, [originalText]);

  const analyzeOriginal = async () => {
    setLoading(true);
    try {
      const analysis = await analyzeIngredients(originalText);
      setOriginalAnalysis(analysis);
      
      // Generate preset scenarios based on analysis
      generatePresetScenarios(analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePresetScenarios = (analysis: Analysis) => {
    const scenarios = [];

    // Remove all high-severity additives
    const highSeverityAdditives = analysis.additives
      .filter(additive => additive.severity === 'high')
      .map(additive => additive.name.toLowerCase());
    
    if (highSeverityAdditives.length > 0) {
      scenarios.push({
        name: 'Remove High-Risk Additives',
        description: 'Remove all additives flagged as high severity',
        ingredients: highSeverityAdditives,
        impact: 'Significantly improves safety profile'
      });
    }

    // Remove California-banned ingredients
    const californiaBanned = analysis.additives
      .filter(additive => 
        additive.jurisdictionStatus?.CA?.banned || 
        additive.name.toLowerCase().includes('red 3') ||
        additive.name.toLowerCase().includes('potassium bromate') ||
        additive.name.toLowerCase().includes('brominated vegetable oil')
      )
      .map(additive => additive.name.toLowerCase());

    if (californiaBanned.length > 0) {
      scenarios.push({
        name: 'California AB 418 Compliance',
        description: 'Remove additives banned under California AB 418',
        ingredients: californiaBanned,
        impact: 'Makes product compliant with California regulations'
      });
    }

    // Remove artificial colors
    const artificialColors = analysis.additives
      .filter(additive => 
        additive.category.toLowerCase().includes('colorant') ||
        additive.name.toLowerCase().includes('red') ||
        additive.name.toLowerCase().includes('yellow') ||
        additive.name.toLowerCase().includes('blue')
      )
      .map(additive => additive.name.toLowerCase());

    if (artificialColors.length > 0) {
      scenarios.push({
        name: 'Remove Artificial Colors',
        description: 'Eliminate all artificial food dyes',
        ingredients: artificialColors,
        impact: 'Appeals to consumers avoiding artificial colors'
      });
    }

    // NOVA improvement scenario
    if (analysis.nova.group >= 3) {
      const ultraProcessingMarkers = [
        'high fructose corn syrup',
        'corn syrup',
        'modified corn starch',
        'artificial vanilla',
        'artificial flavor',
        'artificial flavors'
      ];
      
      scenarios.push({
        name: 'Reduce Ultra-Processing',
        description: 'Remove markers that increase NOVA classification',
        ingredients: ultraProcessingMarkers,
        impact: 'May lower NOVA group classification'
      });
    }

    setPresetScenarios(scenarios);
  };

  const applyScenario = async (scenario: any) => {
    setRemovedIngredients(scenario.ingredients);
    await updateModifiedAnalysis(scenario.ingredients);
  };

  const updateModifiedAnalysis = async (toRemove: string[]) => {
    if (!originalAnalysis) return;

    setLoading(true);
    try {
      // Create modified ingredient text
      const originalIngredients = originalText.split(',').map(ing => ing.trim());
      const modifiedIngredients = originalIngredients.filter(ingredient => {
        const lowerIngredient = ingredient.toLowerCase();
        return !toRemove.some(remove => 
          lowerIngredient.includes(remove.toLowerCase()) ||
          ingredient.toLowerCase() === remove.toLowerCase()
        );
      });
      
      const modifiedText = modifiedIngredients.join(', ');
      const analysis = await analyzeIngredients(modifiedText);
      setModifiedAnalysis(analysis);
    } catch (error) {
      console.error('Modified analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleIngredient = (ingredient: string) => {
    const lowerIngredient = ingredient.toLowerCase();
    const newRemoved = removedIngredients.includes(lowerIngredient)
      ? removedIngredients.filter(item => item !== lowerIngredient)
      : [...removedIngredients, lowerIngredient];
    
    setRemovedIngredients(newRemoved);
    updateModifiedAnalysis(newRemoved);
  };

  const clearAll = () => {
    setRemovedIngredients([]);
    setModifiedAnalysis(null);
  };

  const shareScenario = () => {
    const modifiedText = originalText
      .split(',')
      .map(ing => ing.trim())
      .filter(ingredient => {
        const lowerIngredient = ingredient.toLowerCase();
        return !removedIngredients.some(remove => 
          lowerIngredient.includes(remove.toLowerCase())
        );
      })
      .join(', ');

    const params = new URLSearchParams({
      original: originalText,
      modified: modifiedText,
      removed: removedIngredients.join(',')
    });
    
    const url = `${window.location.origin}/reformulate?${params}`;
    navigator.clipboard.writeText(url);
    
    // Show toast
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg z-50';
    toast.textContent = 'Scenario link copied!';
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  };

  const getDelta = () => {
    if (!originalAnalysis || !modifiedAnalysis) return null;

    return {
      scoreImprovement: modifiedAnalysis.score - originalAnalysis.score,
      novaImprovement: originalAnalysis.nova.group - modifiedAnalysis.nova.group,
      additivesRemoved: originalAnalysis.additives.length - modifiedAnalysis.additives.length,
      allergensRemoved: originalAnalysis.allergens.length - modifiedAnalysis.allergens.length
    };
  };

  const delta = getDelta();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Reformulation Advisor</h1>
        <p className="text-slate-400">
          Discover the minimal changes needed to improve your product's score, NOVA classification, 
          or regulatory compliance. Remove ingredients and see real-time impact.
        </p>
      </div>

      {/* Original Analysis */}
      {originalAnalysis && (
        <div className="mb-8 bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Original Product</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <NovaGauge 
                nova={{...originalAnalysis.nova, note: `NOVA ${originalAnalysis.nova.group} - ${originalAnalysis.nova.markers.length} markers detected`}} 
                score={originalAnalysis.score}
              />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {originalAnalysis.score.toFixed(1)}
              </div>
              <div className="text-slate-400 text-sm">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {originalAnalysis.additives.length}
              </div>
              <div className="text-slate-400 text-sm">Additives Detected</div>
            </div>
          </div>

          <div className="bg-slate-700 rounded p-4 text-sm text-slate-300">
            {originalText}
          </div>
        </div>
      )}

      {/* Preset Scenarios */}
      {presetScenarios.length > 0 && (
        <div className="mb-8 bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">One-Tap Reformulations</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {presetScenarios.map((scenario, index) => (
              <div key={index} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white mb-1">{scenario.name}</h3>
                    <p className="text-slate-400 text-sm">{scenario.description}</p>
                  </div>
                  <button
                    onClick={() => applyScenario(scenario)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-colors"
                    disabled={loading}
                  >
                    Apply
                  </button>
                </div>
                <div className="text-xs text-slate-500 mb-2">
                  Removes: {scenario.ingredients.join(', ')}
                </div>
                <div className="text-xs text-green-400">
                  {scenario.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Ingredient Selection */}
      {originalAnalysis && (
        <div className="mb-8 bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Custom Reformulation</h2>
          <p className="text-slate-400 text-sm mb-4">
            Click ingredients to remove them and see the impact. Changes update in real-time.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {originalText.split(',').map((ingredient, index) => {
              const trimmed = ingredient.trim();
              const isRemoved = removedIngredients.some(removed => 
                trimmed.toLowerCase().includes(removed.toLowerCase()) ||
                trimmed.toLowerCase() === removed.toLowerCase()
              );
              
              return (
                <button
                  key={index}
                  onClick={() => toggleIngredient(trimmed)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    isRemoved 
                      ? 'bg-red-600/20 border border-red-500 text-red-300 line-through' 
                      : 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'
                  }`}
                  aria-pressed={isRemoved}
                >
                  {trimmed}
                </button>
              );
            })}
          </div>

          <div className="flex gap-4">
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
            >
              Reset All
            </button>
            {removedIngredients.length > 0 && (
              <button
                onClick={shareScenario}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
              >
                🔗 Share This Scenario
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results Comparison */}
      {modifiedAnalysis && delta && (
        <div className="mb-8 space-y-6">
          {/* Delta Summary */}
          <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-400 mb-4">Reformulation Impact</h2>
            
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div>
                <div className={`text-2xl font-bold mb-2 ${
                  delta.scoreImprovement > 0 ? 'text-green-400' : 
                  delta.scoreImprovement < 0 ? 'text-red-400' : 'text-slate-400'
                }`}>
                  {delta.scoreImprovement > 0 ? '+' : ''}{delta.scoreImprovement.toFixed(1)}
                </div>
                <div className="text-slate-400 text-sm">Score Change</div>
              </div>
              
              <div>
                <div className={`text-2xl font-bold mb-2 ${
                  delta.novaImprovement > 0 ? 'text-green-400' : 
                  delta.novaImprovement < 0 ? 'text-red-400' : 'text-slate-400'
                }`}>
                  {delta.novaImprovement > 0 ? '-' : delta.novaImprovement < 0 ? '+' : ''}{Math.abs(delta.novaImprovement)}
                </div>
                <div className="text-slate-400 text-sm">NOVA Change</div>
              </div>
              
              <div>
                <div className={`text-2xl font-bold mb-2 ${
                  delta.additivesRemoved > 0 ? 'text-green-400' : 'text-slate-400'
                }`}>
                  -{delta.additivesRemoved}
                </div>
                <div className="text-slate-400 text-sm">Additives Removed</div>
              </div>
              
              <div>
                <div className={`text-2xl font-bold mb-2 ${
                  delta.allergensRemoved > 0 ? 'text-green-400' : 'text-slate-400'
                }`}>
                  -{delta.allergensRemoved}
                </div>
                <div className="text-slate-400 text-sm">Allergens Removed</div>
              </div>
            </div>

            <div className="mt-4 text-center" role="region" aria-live="polite">
              {delta.scoreImprovement > 5 && (
                <div className="text-green-400 font-medium">🎉 Significant improvement!</div>
              )}
              {delta.scoreImprovement > 0 && delta.scoreImprovement <= 5 && (
                <div className="text-green-400">[OK] Positive change</div>
              )}
              {delta.novaImprovement > 0 && (
                <div className="text-green-400">* Lower processing classification</div>
              )}
            </div>
          </div>

          {/* Side-by-side Comparison */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Before</h3>
              <div className="text-center mb-4">
                <NovaGauge 
                  nova={{...originalAnalysis!.nova, note: `NOVA ${originalAnalysis!.nova.group}`}} 
                  score={originalAnalysis!.score}
                />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Score:</span>
                  <span className="text-white">{originalAnalysis!.score.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Additives:</span>
                  <span className="text-white">{originalAnalysis!.additives.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Allergens:</span>
                  <span className="text-white">{originalAnalysis!.allergens.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">After</h3>
              <div className="text-center mb-4">
                <NovaGauge 
                  nova={{...modifiedAnalysis.nova, note: `NOVA ${modifiedAnalysis.nova.group}`}} 
                  score={modifiedAnalysis.score}
                />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Score:</span>
                  <span className="text-white">{modifiedAnalysis.score.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Additives:</span>
                  <span className="text-white">{modifiedAnalysis.additives.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Allergens:</span>
                  <span className="text-white">{modifiedAnalysis.allergens.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="text-white">Analyzing reformulation...</div>
        </div>
      )}
    </div>
  );
}
