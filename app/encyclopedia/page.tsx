'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Badge from '@/components/Badge';
import { ADDITIVES } from '@/lib/rules/additives';
import { ALLERGEN_DATABASE } from '@/lib/rules/allergens';
import { ENCYCLOPEDIA_ENTRIES as STATIC_ENTRIES } from '@/lib/data/encyclopedia';

// Convert our comprehensive databases into encyclopedia format
const convertAdditivesToEncyclopedia = () => {
  return ADDITIVES.map((additive, index) => {
    // Determine consistent regulatory status based on additive severity and known bans
    let usStatus = 'ALLOWED';
    let caStatus = 'ALLOWED';
    let euStatus = 'ALLOWED';
    
    if (additive.key === 'red_3') {
      usStatus = 'ALLOWED IN FOOD, BANNED IN COSMETICS';
      caStatus = 'RESTRICTED UNDER PROPOSED LEGISLATION';
      euStatus = 'ALLOWED WITH STRICT LIMITS';
    } else if (additive.key === 'potassium_bromate') {
      usStatus = 'ALLOWED WITH RESTRICTIONS';
      caStatus = 'BANNED (2018)';
      euStatus = 'BANNED (1990S)';
    } else if (additive.key === 'bvo') {
      usStatus = 'BANNED (AUGUST 2024)';
      caStatus = 'BANNED (2022)';
      euStatus = 'BANNED (MULTIPLE YEARS)';
    } else if (additive.key === 'bha') {
      usStatus = 'ALLOWED WITH LIMITS';
      caStatus = 'RESTRICTED USE';
      euStatus = 'ALLOWED WITH STRICT LIMITS';
    } else if (additive.key === 'partially_hydrogenated') {
      usStatus = 'BANNED (2020)';
      caStatus = 'BANNED (2018)';
      euStatus = 'RESTRICTED (<2G/100G)';
    } else if (additive.severity === 'high') {
      usStatus = 'RESTRICTED';
      caStatus = 'BANNED';
      euStatus = 'RESTRICTED';
    } else if (additive.severity === 'med') {
      usStatus = 'ALLOWED WITH LIMITS';
      caStatus = 'ALLOWED WITH LIMITS';
      euStatus = 'ALLOWED WITH LIMITS';
    } else {
      usStatus = 'GRAS STATUS';
      caStatus = 'ALLOWED';
      euStatus = 'ALLOWED';
    }
    
    return {
      id: `additive-${additive.key}-${index}`,
      name: additive.display,
      aliases: additive.aliases,
      category: additive.category,
      uses: additive.explainer,
      status: {
        US: usStatus,
        CA: caStatus,
        EU: euStatus
      },
      description: additive.explainer,
      concerns: additive.severity === 'high' ? ['High risk compound', 'Regulatory restrictions'] : 
               additive.severity === 'med' ? ['Moderate risk', 'Limited consumption advised'] : 
               ['Generally recognized as safe'],
      alternatives: ['Natural alternatives recommended', 'Check product labels'],
      references: [additive.refUrl || 'FDA Database'],
      source: 'additives'
    };
  });
};

const convertAllergensToEncyclopedia = () => {
  return ALLERGEN_DATABASE.map((allergen, index) => {
    // Consistent allergen regulatory status formatting
    let usStatus = 'NOT REQUIRED LABELING';
    let caStatus = 'NOT REQUIRED LABELING';
    let euStatus = 'NOT REQUIRED LABELING';
    
    if (['Milk/Dairy', 'Eggs', 'Fish', 'Shellfish', 'Tree Nuts', 'Peanuts', 'Wheat', 'Soy'].includes(allergen.name)) {
      usStatus = 'FALCPA TOP 9 ALLERGEN - MANDATORY LABELING';
      caStatus = 'PRIORITY ALLERGEN - MANDATORY DECLARATION';
      euStatus = 'ANNEX II ALLERGEN - MANDATORY LABELING';
    } else if (allergen.name === 'Sesame') {
      usStatus = 'FASTER ACT 2021 - NEW 9TH MAJOR ALLERGEN';
      caStatus = 'PRIORITY ALLERGEN - MANDATORY DECLARATION';
      euStatus = 'ANNEX II ALLERGEN - MANDATORY LABELING';
    } else if (allergen.name === 'Sulfites') {
      usStatus = 'FDA REQUIRES LABELING IF >10PPM';
      caStatus = 'MANDATORY DECLARATION IF >10PPM';
      euStatus = 'ANNEX II - MANDATORY IF >10MG/KG';
    } else if (allergen.name === 'Mustard') {
      usStatus = 'NOT REQUIRED LABELING';
      caStatus = 'PRIORITY ALLERGEN - MANDATORY DECLARATION';
      euStatus = 'ANNEX II ALLERGEN - MANDATORY LABELING';
    } else if (allergen.name === 'Shellfish') {
      usStatus = 'FALCPA TOP 9 ALLERGEN - MANDATORY LABELING';
      caStatus = 'PRIORITY ALLERGEN - MANDATORY DECLARATION';
      euStatus = 'ANNEX II - CRUSTACEANS AND MOLLUSCS SEPARATELY LISTED';
    } else if (allergen.name === 'Wheat') {
      usStatus = 'FALCPA TOP 9 ALLERGEN - MANDATORY LABELING';
      caStatus = 'PRIORITY ALLERGEN - MANDATORY DECLARATION';
      euStatus = 'ANNEX II - CEREALS CONTAINING GLUTEN';
    }
    
    return {
      id: `allergen-${allergen.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${index}`,
      name: allergen.name,
      aliases: allergen.commonTerms,
      category: 'Allergen',
      uses: `Common allergen found in: ${allergen.hiddenSources.slice(0, 3).join(', ')}`,
      status: {
        US: usStatus,
        CA: caStatus,
        EU: euStatus
      },
      description: `Prevalence: ${allergen.prevalence}. Severity: ${allergen.severity}`,
      concerns: allergen.symptoms.slice(0, 3),
      alternatives: allergen.alternatives.slice(0, 3),
      references: ['FDA FASTER Act', 'Health Canada Allergen Guidelines', 'EU Allergen Regulations'],
      source: 'allergens',
      severity: allergen.severity,
      emergencyInfo: allergen.emergencyInfo
    };
  });
};

const convertStaticToEncyclopedia = () => {
  return STATIC_ENTRIES.map((entry, index) => ({
    id: `static-${entry.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${index}`, // Ensure unique IDs
    name: entry.name,
    aliases: entry.commonUses || [], // Use commonUses as aliases since aliases property doesn't exist
    category: entry.category,
    uses: entry.description, // Use description as uses since uses property doesn't exist
    status: {
      US: entry.regulatoryStatus.us || 'Unknown',
      CA: entry.regulatoryStatus.ca || 'Unknown',
      EU: entry.regulatoryStatus.eu || 'Unknown'
    },
    description: entry.description,
    concerns: entry.healthConcerns || [],
    alternatives: entry.alternatives || [],
    references: entry.scientificEvidence ? [entry.scientificEvidence] : [],
    source: 'encyclopedia'
  }));
};

// Combine all our comprehensive databases
const COMPREHENSIVE_ENCYCLOPEDIA = [
  ...convertAdditivesToEncyclopedia(),
  ...convertAllergensToEncyclopedia(), 
  ...convertStaticToEncyclopedia()
];

export default function EncyclopediaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEntry, setSelectedEntry] = useState<typeof COMPREHENSIVE_ENCYCLOPEDIA[0] | null>(null);
  const [filteredEntries, setFilteredEntries] = useState(COMPREHENSIVE_ENCYCLOPEDIA);
  const router = useRouter();

  const categories = ['All', ...new Set(COMPREHENSIVE_ENCYCLOPEDIA.map(entry => entry.category))];

  useEffect(() => {
    let filtered = COMPREHENSIVE_ENCYCLOPEDIA;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.name.toLowerCase().includes(term) ||
        entry.aliases.some((alias: string) => alias.toLowerCase().includes(term)) ||
        entry.description.toLowerCase().includes(term) ||
        entry.uses.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(entry => entry.category === selectedCategory);
    }

    setFilteredEntries(filtered);
  }, [searchTerm, selectedCategory]);

  const handleUseInAnalysis = (entry: typeof COMPREHENSIVE_ENCYCLOPEDIA[0]) => {
    // Create a sample ingredient list containing this additive
    const sampleIngredient = `Water, sugar, ${entry.name.toLowerCase()}, salt, natural flavors`;
    const params = new URLSearchParams({ q: sampleIngredient });
    router.push(`/results?${params}`);
  };

  const getStatusColor = (status: string) => {
    if (status.includes('BANNED') || status.includes('PROHIBITED')) return 'bg-red-100 text-red-800';
    if (status.includes('RESTRICTED') || status.includes('LIMITS')) return 'bg-yellow-100 text-yellow-800';
    if (status.includes('ALLOWED') || status.includes('GRAS')) return 'bg-green-100 text-green-800';
    if (status.includes('MANDATORY') || status.includes('REQUIRED')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          const searchInput = document.getElementById('encyclopedia-search') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
        }
      }
      if (e.key === 'Escape') {
        setSelectedEntry(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Additive & Allergen Encyclopedia</h1>
        <p className="text-slate-400">
          Comprehensive information about food additives, their uses, regulatory status, 
          and alternatives. Press "/" to focus search.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 bg-slate-800 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="encyclopedia-search" className="block text-sm font-medium text-white mb-2">
              Search additives and allergens
            </label>
            <input
              id="encyclopedia-search"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, alias, or description..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-white mb-2">
              Category
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {searchTerm && (
          <div className="mt-4 text-sm text-slate-400">
            Showing {filteredEntries.length} of {COMPREHENSIVE_ENCYCLOPEDIA.length} entries
          </div>
        )}
      </div>

      {/* Entry Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredEntries.map((entry) => (
          <div key={entry.id} className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{entry.name}</h3>
                <Badge text={entry.category} tone="ok" />
              </div>
            </div>

            <p className="text-slate-400 text-sm mb-4 line-clamp-3">{entry.description}</p>

            <div className="mb-4">
              <div className="text-xs text-slate-500 mb-2">Regulatory Status:</div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(entry.status.US)}`}>
                  US: {entry.status.US.toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(entry.status.CA)}`}>
                  CA: {entry.status.CA.toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(entry.status.EU)}`}>
                  EU: {entry.status.EU.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedEntry(entry)}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-colors"
              >
                Learn More
              </button>
              <button
                onClick={() => handleUseInAnalysis(entry)}
                className="px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded transition-colors"
                title="Analyze a sample containing this additive"
              >
                Analyze
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">No entries found matching your search.</div>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Detailed Entry Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedEntry.name}</h2>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge text={selectedEntry.category} tone="ok" />
                    {selectedEntry.aliases.slice(0, 3).map((alias: string, index: number) => (
                      <Badge key={`alias-${index}`} text={alias} tone="warn" />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-slate-400 hover:text-white p-2"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                    <p className="text-slate-300 text-sm">{selectedEntry.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Common Uses</h3>
                    <p className="text-slate-300 text-sm">{selectedEntry.uses}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Health Concerns</h3>
                    <ul className="space-y-1">
                      {selectedEntry.concerns.map((concern, index) => (
                        <li key={index} className="text-slate-300 text-sm">• {concern}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Regulatory Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">United States (FDA)</span>
                        <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(selectedEntry.status.US)}`}>
                          {selectedEntry.status.US.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">California AB 418</span>
                        <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(selectedEntry.status.CA)}`}>
                          {selectedEntry.status.CA.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">European Union</span>
                        <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(selectedEntry.status.EU)}`}>
                          {selectedEntry.status.EU.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Alternatives</h3>
                    <ul className="space-y-1">
                      {selectedEntry.alternatives.map((alternative, index) => (
                        <li key={index} className="text-slate-300 text-sm">• {alternative}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">All Names & Aliases</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.aliases.map((alias: string, index: number) => (
                        <Badge key={`all-alias-${index}`} text={alias} tone="warn" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-2">References</h3>
                <ul className="space-y-1">
                  {Array.isArray(selectedEntry.references) ? selectedEntry.references.map((reference, index) => (
                    <li key={index} className="text-slate-400 text-sm">• {reference}</li>
                  )) : (
                    <li className="text-slate-400 text-sm">• {selectedEntry.references}</li>
                  )}
                </ul>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => handleUseInAnalysis(selectedEntry)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                  🔬 Analyze Sample with This Additive
                </button>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
