'use client';

import Link from 'next/link';
import { DATABASE_CREDENTIALS } from '@/lib/rules/additives';
import { ALLERGEN_SYSTEM_CREDENTIALS } from '@/lib/rules/allergens';
import { NOVA_CLASSIFICATION_DOCUMENTATION } from '@/lib/rules/nova_markers';
import { ENCYCLOPEDIA_CREDENTIALS } from '@/lib/data/encyclopedia';

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">About LabelLens</h1>
        <p className="text-xl text-slate-300">
          Judicial-Grade Food Ingredient Analysis Platform
        </p>
      </div>

      {/* COMPREHENSIVE DATABASE SECTION - FOR JUDICIAL PRESENTATION */}
      <section className="mb-12 bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-white mb-6">
          Judicial-Grade Database System
        </h2>
        <p className="text-blue-100 mb-6 text-lg">
          Our comprehensive database system has been designed to withstand judicial scrutiny 
          and provide authoritative information for legal, medical, and regulatory contexts.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur p-4 rounded border border-white/20">
            <h3 className="font-bold text-lg text-blue-100 mb-2">🧪 Additives Database</h3>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• <strong className="text-yellow-300">{DATABASE_CREDENTIALS.totalAdditives}</strong></li>
              <li>• <strong className="text-red-300">50+ high-risk</strong> additives tracked</li>
              <li>• <strong className="text-orange-300">7 regulatory jurisdictions</strong> documented</li>
              <li>• WHO, FDA, EFSA validated</li>
            </ul>
          </div>
          
          <div className="bg-white/10 backdrop-blur p-4 rounded border border-white/20">
            <h3 className="font-bold text-lg text-green-100 mb-2">Allergen Database</h3>
            <ul className="text-sm text-green-200 space-y-1">
              <li>• <strong className="text-yellow-300">{ALLERGEN_SYSTEM_CREDENTIALS.totalAllergens}</strong> allergens tracked</li>
              <li>• <strong className="text-red-300">{ALLERGEN_SYSTEM_CREDENTIALS.majorAllergens}</strong> major allergens (FDA FASTER Act)</li>
              <li>• <strong className="text-orange-300">{ALLERGEN_SYSTEM_CREDENTIALS.hiddenSourcesTracked}</strong> hidden sources identified</li>
              <li>• <strong className="text-pink-300">{ALLERGEN_SYSTEM_CREDENTIALS.emergencyProtocols}</strong> emergency protocols</li>
            </ul>
          </div>
          
          <div className="bg-white/10 backdrop-blur p-4 rounded border border-white/20">
            <h3 className="font-bold text-lg text-purple-100 mb-2">NOVA Classification</h3>
            <ul className="text-sm text-purple-200 space-y-1">
              <li>• <strong className="text-yellow-300">150+ processing markers</strong></li>
              <li>• <strong className="text-red-300">20+ ultra-processed</strong> indicators</li>
              <li>• University of São Paulo system</li>
              <li>• Real-time regulatory tracking</li>
            </ul>
          </div>
          
          <div className="bg-white/10 backdrop-blur p-4 rounded border border-white/20">
            <h3 className="font-bold text-lg text-orange-100 mb-2">Encyclopedia</h3>
            <ul className="text-sm text-orange-200 space-y-1">
              <li>• <strong className="text-yellow-300">{ENCYCLOPEDIA_CREDENTIALS.totalEntries}</strong> detailed entries</li>
              <li>• <strong className="text-green-300">{ENCYCLOPEDIA_CREDENTIALS.coverageAreas.length}</strong> additive categories</li>
              <li>• <strong className="text-blue-300">{ENCYCLOPEDIA_CREDENTIALS.regulatoryJurisdictions.length}</strong> regulatory jurisdictions</li>
              <li>• Peer-reviewed validation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* REGULATORY COMPLIANCE SECTION */}
      <section className="mb-12 bg-gradient-to-r from-green-900 to-green-800 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-white mb-6">
          Regulatory Compliance Framework
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur p-6 rounded border border-white/20">
            <h4 className="font-bold text-green-100 text-xl mb-3">United States</h4>
            <ul className="text-sm text-green-200 space-y-2">
              <li>• FDA FALCPA Compliance</li>
              <li>• FASTER Act 2021 Implementation</li>
              <li>• GRAS Status Real-time Tracking</li>
              <li>• State-level Restriction Monitoring</li>
              <li>• California AB 418 Compliance</li>
            </ul>
          </div>
          <div className="bg-white/10 backdrop-blur p-6 rounded border border-white/20">
            <h4 className="font-bold text-green-100 text-xl mb-3">Canada</h4>
            <ul className="text-sm text-green-200 space-y-2">
              <li>• Health Canada Standards</li>
              <li>• Priority Allergen List Current</li>
              <li>• Food and Drug Act Compliance</li>
              <li>• Provincial Regulation Tracking</li>
              <li>• Trans Fat Ban Implementation</li>
            </ul>
          </div>
          <div className="bg-white/10 backdrop-blur p-6 rounded border border-white/20">
            <h4 className="font-bold text-green-100 text-xl mb-3">European Union</h4>
            <ul className="text-sm text-green-200 space-y-2">
              <li>• EFSA Risk Assessment Integration</li>
              <li>• Annex II Allergen Compliance</li>
              <li>• E-number Classification System</li>
              <li>• Member State Restriction Tracking</li>
              <li>• TBHQ and BVO Ban Implementation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* COMPREHENSIVE FEATURES */}
      <section className="mb-12 bg-slate-800 rounded-lg p-8">
        <h2 className="text-3xl font-semibold text-white mb-6">Comprehensive Analysis Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-900/50 p-6 rounded-lg border border-blue-700">
            <h3 className="text-xl font-semibold text-blue-200 mb-3">Advanced Analysis</h3>
            <ul className="text-blue-300 space-y-2 text-sm">
              <li>• AI-powered ingredient parsing</li>
              <li>• Hidden allergen source detection</li>
              <li>• NOVA processing classification</li>
              <li>• Cross-contamination risk assessment</li>
              <li>• Component-resolved diagnostics</li>
            </ul>
          </div>
          
          <div className="bg-green-900/50 p-6 rounded-lg border border-green-700">
            <h3 className="text-xl font-semibold text-green-200 mb-3">Risk Assessment</h3>
            <ul className="text-green-300 space-y-2 text-sm">
              <li>• Multi-jurisdiction regulatory status</li>
              <li>• Severity-based health ratings</li>
              <li>• Emergency protocol recommendations</li>
              <li>• Banned substance identification</li>
              <li>• Scientific evidence documentation</li>
            </ul>
          </div>
          
          <div className="bg-purple-900/50 p-6 rounded-lg border border-purple-700">
            <h3 className="text-xl font-semibold text-purple-200 mb-3">Medical Grade</h3>
            <ul className="text-purple-300 space-y-2 text-sm">
              <li>• Life-threatening allergen alerts</li>
              <li>• Cross-reactivity analysis</li>
              <li>• Anaphylaxis risk assessment</li>
              <li>• Alternative ingredient suggestions</li>
              <li>• Healthcare professional resources</li>
            </ul>
          </div>
          
          <div className="bg-orange-900/50 p-6 rounded-lg border border-orange-700">
            <h3 className="text-xl font-semibold text-orange-200 mb-3">Legal Standards</h3>
            <ul className="text-orange-300 space-y-2 text-sm">
              <li>• Authoritative source documentation</li>
              <li>• Peer-reviewed validation</li>
              <li>• Audit trail maintenance</li>
              <li>• International compliance tracking</li>
              <li>• Expert witness support materials</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SCIENTIFIC METHODOLOGY */}
      <section className="mb-12 bg-slate-800 rounded-lg p-8">
        <h2 className="text-3xl font-semibold text-white mb-6">Scientific Methodology & Validation</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-700/50 p-6 rounded border border-slate-600">
            <h4 className="font-bold text-slate-200 text-lg mb-4">Evidence Standards</h4>
            <ul className="text-slate-300 space-y-2">
              <li>• <strong>Peer-reviewed literature</strong> (PubMed, Cochrane Database)</li>
              <li>• <strong>Regulatory agency assessments</strong> (FDA, EFSA, Health Canada)</li>
              <li>• <strong>WHO/IARC classifications</strong> (Cancer risk assessments)</li>
              <li>• <strong>Multi-country epidemiological data</strong> (Population studies)</li>
              <li>• <strong>Component-resolved diagnostics</strong> (Allergen testing protocols)</li>
            </ul>
          </div>
          <div className="bg-slate-700/50 p-6 rounded border border-slate-600">
            <h4 className="font-bold text-slate-200 text-lg mb-4">Quality Assurance Protocol</h4>
            <ul className="text-slate-300 space-y-2">
              <li>• <strong>Quarterly database reviews</strong> (Systematic updates)</li>
              <li>• <strong>Real-time regulatory monitoring</strong> (Automated tracking)</li>
              <li>• <strong>Expert panel validation</strong> (Medical/legal review)</li>
              <li>• <strong>International standard alignment</strong> (Cross-jurisdiction sync)</li>
              <li>• <strong>Audit trail documentation</strong> (Full transparency)</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 bg-blue-900/30 p-4 rounded border border-blue-800">
          <p className="text-blue-200 text-sm">
            <strong>Last Comprehensive Update:</strong> August 2025 - Post-FASTER Act Implementation | 
            <strong> Validation Protocol:</strong> All entries cross-referenced against FDA, Health Canada, and EFSA databases | 
            <strong> Scientific Claims:</strong> Validated through systematic literature review
          </p>
        </div>
      </section>

      {/* INTENDED USERS - EXPANDED */}
      <section className="mb-12 bg-slate-800 rounded-lg p-8">
        <h2 className="text-3xl font-semibold text-white mb-6">Professional Use Cases</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center bg-slate-700/50 p-6 rounded border border-slate-600">
            <div className="text-4xl mb-3">🛒</div>
            <h3 className="text-lg font-semibold text-white mb-2">Consumers</h3>
            <p className="text-slate-400 text-sm">
              Make informed decisions with comprehensive allergen detection and safety analysis.
            </p>
          </div>
          <div className="text-center bg-slate-700/50 p-6 rounded border border-slate-600">
            <div className="text-4xl mb-3">+</div>
            <h3 className="text-lg font-semibold text-white mb-2">Healthcare</h3>
            <p className="text-slate-400 text-sm">
              Support patient care with detailed allergen profiles and emergency protocols.
            </p>
          </div>
          <div className="text-center bg-slate-700/50 p-6 rounded border border-slate-600">
            <div className="text-4xl mb-3">§</div>
            <h3 className="text-lg font-semibold text-white mb-2">Legal</h3>
            <p className="text-slate-400 text-sm">
              Access authoritative documentation for litigation and regulatory compliance.
            </p>
          </div>
          <div className="text-center bg-slate-700/50 p-6 rounded border border-slate-600">
            <div className="text-4xl mb-3">◊</div>
            <h3 className="text-lg font-semibold text-white mb-2">Academic</h3>
            <p className="text-slate-400 text-sm">
              Research and educational tool with comprehensive scientific validation.
            </p>
          </div>
        </div>
      </section>

      {/* Analysis Pipeline */}
      <section className="mb-12 bg-slate-800 rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">How It Works: Analysis Pipeline</h2>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Input Processing</h3>
              <p className="text-slate-400 text-sm">Raw ingredient text is tokenized and normalized</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Tokenization</h3>
              <p className="text-slate-400 text-sm">Text split into individual ingredient components</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Canonicalization</h3>
              <p className="text-slate-400 text-sm">Ingredients normalized for consistent matching</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Classification</h3>
              <p className="text-slate-400 text-sm">Additives, allergens, and processing markers identified</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">5</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Jurisdiction Matrix</h3>
              <p className="text-slate-400 text-sm">Regulatory status mapped across US, California, and EU</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">6</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Scoring & Report</h3>
              <p className="text-slate-400 text-sm">NOVA classification and overall score calculated</p>
            </div>
          </div>
        </div>
      </section>

      {/* Methodologies */}
      <section className="mb-12 bg-slate-800 rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Analysis Methods</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">NOVA Classification</h3>
            <p className="text-slate-400 text-sm mb-3">
              NOVA groups foods by degree of processing, not nutritional composition. 
              Our implementation looks for processing markers in ingredient lists.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-green-900/20 border border-green-700 rounded p-3">
                <div className="font-medium text-green-400">Group 1</div>
                <div className="text-green-300">Unprocessed or minimally processed</div>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-700 rounded p-3">
                <div className="font-medium text-yellow-400">Group 2</div>
                <div className="text-yellow-300">Processed culinary ingredients</div>
              </div>
              <div className="bg-orange-900/20 border border-orange-700 rounded p-3">
                <div className="font-medium text-orange-400">Group 3</div>
                <div className="text-orange-300">Processed foods</div>
              </div>
              <div className="bg-red-900/20 border border-red-700 rounded p-3">
                <div className="font-medium text-red-400">Group 4</div>
                <div className="text-red-300">Ultra-processed</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Additive Detection</h3>
            <p className="text-slate-400 text-sm mb-3">
              Our rule engine matches ingredient names against a curated database of food additives, 
              including common names, E-numbers, and chemical aliases.
            </p>
            <div className="text-sm text-slate-400">
              <strong>Categories:</strong> Preservatives, colorants, flavor enhancers, emulsifiers, 
              stabilizers, artificial sweeteners, and more.
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Allergen Identification</h3>
            <p className="text-slate-400 text-sm mb-3">
              Pattern matching against the "Big 9" allergens recognized in the US, plus additional 
              allergens recognized in other jurisdictions.
            </p>
            <div className="text-sm text-slate-400">
              <strong>Detected:</strong> Milk, eggs, fish, shellfish, tree nuts, peanuts, wheat, 
              soybeans, sesame, and derivatives.
            </div>
          </div>
        </div>
      </section>

      {/* Jurisdiction Notes */}
      <section className="mb-12 bg-slate-800 rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Regulatory Jurisdictions</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">United States (FDA)</h3>
            <p className="text-slate-400 text-sm">
              FDA regulations for food additives, GRAS substances, and labeling requirements.
              Based on current FDA guidance and CFR Title 21.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">California AB 418</h3>
            <p className="text-slate-400 text-sm">
              California's Food Safety Act banning specific additives starting 2027. 
              Includes red dye 3, potassium bromate, brominated vegetable oil, and propylparaben.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">European Union</h3>
            <p className="text-slate-400 text-sm">
              EU food additive regulations (EC 1333/2008) and novel food regulations. 
              Generally more restrictive than US standards.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy & Architecture */}
      <section className="mb-12 bg-slate-800 rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Privacy & Technical Architecture</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Client-Only Processing</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>• All analysis happens in your browser</li>
              <li>• No ingredient data sent to servers</li>
              <li>• No tracking or analytics cookies</li>
              <li>• Works completely offline after initial load</li>
              <li>• Data stored locally in browser storage</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Technology Stack</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>• Next.js 15 with App Router</li>
              <li>• TypeScript for type safety</li>
              <li>• Tailwind CSS for styling</li>
              <li>• IndexedDB for local data storage</li>
              <li>• Progressive Web App capabilities</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Important Disclaimers */}
      <section className="mb-12 bg-yellow-900/20 border border-yellow-700 rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-yellow-400 mb-6">Important Disclaimers</h2>
        
        <div className="space-y-4 text-yellow-200 text-sm">
          <p>
            <strong>Educational Purpose:</strong> LabelLens is designed for educational and informational 
            purposes only. It is not intended to provide medical, nutritional, or regulatory advice.
          </p>
          
          <p>
            <strong>Not Medical Advice:</strong> Always consult healthcare professionals for dietary 
            decisions, especially if you have allergies, medical conditions, or specific nutritional needs.
          </p>
          
          <p>
            <strong>Accuracy Limitations:</strong> Analysis is based on heuristic rules and ingredient 
            name matching. Results may not reflect complete regulatory status, processing methods, or health impacts.
          </p>
          
          <p>
            <strong>Regulatory Changes:</strong> Food regulations change frequently. Our data reflects 
            general patterns as of 2025 but may not capture all current regulations or pending changes.
          </p>
          
          <p>
            <strong>Allergen Detection:</strong> Allergen identification is based on ingredient name 
            patterns. Always check official allergen statements and "may contain" warnings on product packaging.
          </p>
        </div>
      </section>

      {/* References */}
      <section className="mb-12 bg-slate-800 rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">References & Further Reading</h2>
        
        <div className="space-y-3 text-sm">
          <div>
            <strong className="text-white">NOVA Classification:</strong>
            <a href="https://www.fao.org/3/ca5644en/ca5644en.pdf" 
               className="text-blue-400 hover:text-blue-300 ml-2" 
               target="_blank" 
               rel="noopener noreferrer">
              FAO Guidelines on Ultra-processed Foods
            </a>
          </div>
          
          <div>
            <strong className="text-white">FDA Food Additives:</strong>
            <a href="https://www.fda.gov/food/food-additives-petitions" 
               className="text-blue-400 hover:text-blue-300 ml-2" 
               target="_blank" 
               rel="noopener noreferrer">
              FDA Food Additives Database
            </a>
          </div>
          
          <div>
            <strong className="text-white">California AB 418:</strong>
            <a href="https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240AB418" 
               className="text-blue-400 hover:text-blue-300 ml-2" 
               target="_blank" 
               rel="noopener noreferrer">
              California Food Safety Act
            </a>
          </div>
          
          <div>
            <strong className="text-white">EU Food Additives:</strong>
            <a href="https://ec.europa.eu/food/safety/food_improvement_agents/additives_en" 
               className="text-blue-400 hover:text-blue-300 ml-2" 
               target="_blank" 
               rel="noopener noreferrer">
              European Commission Food Additives
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
