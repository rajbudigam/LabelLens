'use client';

import { useState, useEffect } from 'react';
import Badge from '@/components/Badge';

interface Rule {
  id: string;
  name: string;
  description: string;
  category: 'additive' | 'allergen' | 'nova' | 'custom';
  pattern: string;
  severity: 'low' | 'medium' | 'high';
  enabled: boolean;
  jurisdictions: string[];
  tags: string[];
}

interface TestResult {
  matched: boolean;
  details: string;
  captures: string[];
}

const SAMPLE_RULES: Rule[] = [
  {
    id: 'red-dye-3',
    name: 'Red Dye #3 Detection',
    description: 'Detects Red 3/Erythrosine, banned in California AB 418',
    category: 'additive',
    pattern: '(?i)\\b(red\\s*#?\\s*3|erythrosine|e\\s*127)\\b',
    severity: 'high',
    enabled: true,
    jurisdictions: ['CA', 'EU'],
    tags: ['artificial-color', 'banned']
  },
  {
    id: 'high-fructose-corn-syrup',
    name: 'High Fructose Corn Syrup',
    description: 'Identifies HFCS as ultra-processing marker',
    category: 'nova',
    pattern: '(?i)\\b(high\\s*fructose\\s*corn\\s*syrup|hfcs)\\b',
    severity: 'medium',
    enabled: true,
    jurisdictions: ['US', 'CA'],
    tags: ['sweetener', 'ultra-processed']
  },
  {
    id: 'gluten-detection',
    name: 'Gluten Sources',
    description: 'Detects common gluten-containing ingredients',
    category: 'allergen',
    pattern: '(?i)\\b(wheat|barley|rye|spelt|triticale|malt)\\b',
    severity: 'high',
    enabled: true,
    jurisdictions: ['US', 'CA', 'EU'],
    tags: ['allergen', 'gluten']
  }
];

export default function DeveloperPage() {
  const [rules, setRules] = useState<Rule[]>(SAMPLE_RULES);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [testIngredients, setTestIngredients] = useState('wheat flour, high fructose corn syrup, red 3, natural flavors');
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [newRule, setNewRule] = useState<Partial<Rule>>({});
  const [showEditor, setShowEditor] = useState(false);
  const [activeTab, setActiveTab] = useState('playground');

  // Test all rules against current ingredients
  useEffect(() => {
    const results: Record<string, TestResult> = {};
    
    rules.forEach(rule => {
      if (!rule.enabled) return;
      
      try {
        const regex = new RegExp(rule.pattern, 'gi');
        const matches = testIngredients.match(regex) || [];
        
        results[rule.id] = {
          matched: matches.length > 0,
          details: matches.length > 0 ? `Found: ${matches.join(', ')}` : 'No matches',
          captures: matches
        };
      } catch (error) {
        results[rule.id] = {
          matched: false,
          details: `Error: Invalid regex pattern`,
          captures: []
        };
      }
    });
    
    setTestResults(results);
  }, [rules, testIngredients]);

  const addRule = () => {
    if (!newRule.name || !newRule.pattern) return;
    
    const rule: Rule = {
      id: Date.now().toString(),
      name: newRule.name,
      description: newRule.description || '',
      category: newRule.category || 'custom',
      pattern: newRule.pattern,
      severity: newRule.severity || 'medium',
      enabled: true,
      jurisdictions: newRule.jurisdictions || ['US'],
      tags: newRule.tags || []
    };
    
    setRules([...rules, rule]);
    setNewRule({});
    setShowEditor(false);
  };

  const updateRule = (id: string, updates: Partial<Rule>) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    ));
  };

  const deleteRule = (id: string) => {
    if (confirm('Delete this rule?')) {
      setRules(rules.filter(rule => rule.id !== id));
    }
  };

  const exportRules = () => {
    const dataStr = JSON.stringify(rules, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `labellens-rules-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importRules = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setRules([...rules, ...imported]);
      } catch (error) {
        alert('Invalid rules file');
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: 'playground', label: 'Rule Playground', icon: '🔬' },
    { id: 'editor', label: 'Rule Editor', icon: 'Edit' },
    { id: 'performance', label: 'Performance', icon: '⚡' },
    { id: 'api', label: 'API Documentation', icon: '*' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Developer Tools</h1>
        <p className="text-slate-400">
          Advanced tools for testing, creating, and debugging ingredient analysis rules.
          Perfect for food scientists, regulatory experts, and developers.
        </p>
      </div>

      {/* Navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rule Playground */}
      {activeTab === 'playground' && (
        <div className="space-y-6">
          {/* Test Input */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Test Ingredients</h2>
            <textarea
              value={testIngredients}
              onChange={(e) => setTestIngredients(e.target.value)}
              placeholder="Enter ingredient list to test against rules..."
              rows={4}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Rules List */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Active Rules</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditor(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
                >
                  ➕ Add Rule
                </button>
                <button
                  onClick={exportRules}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                >
                  📁 Export
                </button>
                <label className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors cursor-pointer">
                  📂 Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={importRules}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              {rules.map((rule) => {
                const result = testResults[rule.id];
                return (
                  <div key={rule.id} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-white">{rule.name}</h3>
                          <Badge text={rule.category} tone={rule.category === 'additive' ? 'warn' : rule.category === 'allergen' ? 'danger' : 'ok'} />
                          <Badge text={rule.severity} tone={rule.severity === 'high' ? 'danger' : rule.severity === 'medium' ? 'warn' : 'ok'} />
                          {result?.matched && (
                            <Badge text="MATCH" tone="ok" />
                          )}
                        </div>
                        <p className="text-slate-400 text-sm mb-2">{rule.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {rule.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-slate-600 text-slate-300 text-xs rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        {result && (
                          <div className={`text-sm ${result.matched ? 'text-green-400' : 'text-slate-400'}`}>
                            {result.details}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={rule.enabled}
                            onChange={(e) => updateRule(rule.id, { enabled: e.target.checked })}
                            className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-white text-sm">Enabled</span>
                        </label>
                        <button
                          onClick={() => setSelectedRule(rule)}
                          className="p-2 text-slate-400 hover:text-white transition-colors"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteRule(rule.id)}
                          className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-800 rounded p-3">
                      <div className="text-slate-400 text-sm mb-1">Pattern:</div>
                      <code className="text-green-400 text-sm font-mono">{rule.pattern}</code>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Rule Editor */}
      {activeTab === 'editor' && (
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Regex Pattern Reference</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-white mb-3">Common Patterns</h3>
              <div className="space-y-3">
                <div className="bg-slate-700 rounded p-3">
                  <div className="text-green-400 font-mono text-sm mb-1">(?i)\\b(red\\s*#?\\s*3)\\b</div>
                  <div className="text-slate-400 text-sm">Case-insensitive word boundary match for "Red #3"</div>
                </div>
                <div className="bg-slate-700 rounded p-3">
                  <div className="text-green-400 font-mono text-sm mb-1">{'(?i)\\b(e\\s*\\d{3,4})\\b'}</div>
                  <div className="text-slate-400 text-sm">E-numbers (E100, E621, etc.)</div>
                </div>
                <div className="bg-slate-700 rounded p-3">
                  <div className="text-green-400 font-mono text-sm mb-1">(?i)\\b(artificial\\s+\\w+)\\b</div>
                  <div className="text-slate-400 text-sm">Artificial + any word (flavors, colors, etc.)</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-3">Regex Cheat Sheet</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <code className="text-green-400">(?i)</code>
                  <span className="text-slate-400">Case insensitive</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-green-400">\\b</code>
                  <span className="text-slate-400">Word boundary</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-green-400">\\s+</code>
                  <span className="text-slate-400">One or more spaces</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-green-400">\\d+</code>
                  <span className="text-slate-400">One or more digits</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-green-400">\\w+</code>
                  <span className="text-slate-400">One or more word chars</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-green-400">(a|b)</code>
                  <span className="text-slate-400">Alternative (a or b)</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-green-400">?</code>
                  <span className="text-slate-400">Optional (0 or 1)</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-green-400">*</code>
                  <span className="text-slate-400">Zero or more</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-900/20 border border-amber-700 rounded-lg p-4 mb-6">
            <div className="text-amber-400 font-medium mb-2">[!] Performance Tips</div>
            <ul className="text-amber-300 text-sm space-y-1">
              <li>• Use word boundaries (\\b) to avoid partial matches</li>
              <li>• Be specific rather than using broad wildcards</li>
              <li>• Test patterns thoroughly with edge cases</li>
              <li>• Consider regional spelling variations</li>
            </ul>
          </div>
        </div>
      )}

      {/* Performance */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Rule Performance Metrics</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{rules.filter(r => r.enabled).length}</div>
                <div className="text-slate-400">Active Rules</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {Object.values(testResults).filter(r => r.matched).length}
                </div>
                <div className="text-slate-400">Current Matches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">~{rules.length * 2}ms</div>
                <div className="text-slate-400">Est. Processing Time</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Rule Categories</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {['additive', 'allergen', 'nova', 'custom'].map(category => {
                const count = rules.filter(r => r.category === category).length;
                return (
                  <div key={category} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-white capitalize">{category} Rules</div>
                      <div className="text-2xl font-bold text-blue-400">{count}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* API Documentation */}
      {activeTab === 'api' && (
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">API Documentation</h2>
          
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-white mb-3">Rule Format</h3>
              <div className="bg-slate-700 rounded-lg p-4">
                <pre className="text-green-400 text-sm overflow-x-auto">
{`{
  "id": "unique-rule-id",
  "name": "Human-readable name",
  "description": "What this rule detects",
  "category": "additive|allergen|nova|custom",
  "pattern": "(?i)\\\\b(regex pattern)\\\\b",
  "severity": "low|medium|high",
  "enabled": true,
  "jurisdictions": ["US", "CA", "EU"],
  "tags": ["tag1", "tag2"]
}`}
                </pre>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">Pattern Guidelines</h3>
              <div className="text-slate-300 space-y-2">
                <p>• Always use case-insensitive matching: <code className="text-green-400">(?i)</code></p>
                <p>• Use word boundaries to avoid partial matches: <code className="text-green-400">\\b</code></p>
                <p>• Handle spacing variations: <code className="text-green-400">\\s*</code> or <code className="text-green-400">\\s+</code></p>
                <p>• Consider alternative spellings and abbreviations</p>
                <p>• Test with real ingredient lists for accuracy</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">Integration</h3>
              <div className="text-slate-300 space-y-4">
                <p>
                  Rules created here can be exported and integrated into the main LabelLens analysis engine.
                  Custom rules are processed alongside built-in detection algorithms.
                </p>
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                  <div className="text-blue-400 font-medium mb-2">TIP Pro Tip</div>
                  <div className="text-blue-300 text-sm">
                    Use the playground to test rules against real product labels before deploying.
                    False positives can be worse than false negatives in food safety applications.
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Rule Editor Modal */}
      {(showEditor || selectedRule) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">
              {selectedRule ? 'Edit Rule' : 'Create New Rule'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  value={selectedRule ? selectedRule.name : newRule.name || ''}
                  onChange={(e) => selectedRule 
                    ? updateRule(selectedRule.id, { name: e.target.value })
                    : setNewRule({ ...newRule, name: e.target.value })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={selectedRule ? selectedRule.description : newRule.description || ''}
                  onChange={(e) => selectedRule
                    ? updateRule(selectedRule.id, { description: e.target.value })
                    : setNewRule({ ...newRule, description: e.target.value })
                  }
                  rows={2}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <select
                    value={selectedRule ? selectedRule.category : newRule.category || 'custom'}
                    onChange={(e) => selectedRule
                      ? updateRule(selectedRule.id, { category: e.target.value as any })
                      : setNewRule({ ...newRule, category: e.target.value as any })
                    }
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="additive">Additive</option>
                    <option value="allergen">Allergen</option>
                    <option value="nova">NOVA</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Severity</label>
                  <select
                    value={selectedRule ? selectedRule.severity : newRule.severity || 'medium'}
                    onChange={(e) => selectedRule
                      ? updateRule(selectedRule.id, { severity: e.target.value as any })
                      : setNewRule({ ...newRule, severity: e.target.value as any })
                    }
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Regex Pattern</label>
                <textarea
                  value={selectedRule ? selectedRule.pattern : newRule.pattern || ''}
                  onChange={(e) => selectedRule
                    ? updateRule(selectedRule.id, { pattern: e.target.value })
                    : setNewRule({ ...newRule, pattern: e.target.value })
                  }
                  rows={3}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono"
                  placeholder="(?i)\\b(pattern here)\\b"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              {selectedRule ? (
                <button
                  onClick={() => setSelectedRule(null)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
                >
                  Done
                </button>
              ) : (
                <button
                  onClick={addRule}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors"
                >
                  Create Rule
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedRule(null);
                  setShowEditor(false);
                  setNewRule({});
                }}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
