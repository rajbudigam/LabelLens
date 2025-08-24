'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TextArea from '@/components/TextArea';
import AnalyzeButton from '@/components/AnalyzeButton';

const SAMPLE_INGREDIENTS = [
  {
    name: "Organic Yogurt",
    ingredients: "Cultured pasteurized grade A milk, strawberries, cane sugar, pectin."
  },
  {
    name: "Energy Drink",
    ingredients: "Carbonated water, brominated vegetable oil, natural flavor, caffeine."
  },
  {
    name: "Breakfast Cereal",
    ingredients: "Whole grain oats, sugar, salt, calcium carbonate, iron, vitamin A palmitate, niacinamide, zinc oxide, reduced iron, pyridoxine hydrochloride, riboflavin, thiamine mononitrate, folic acid, vitamin B12, vitamin D3."
  },
  {
    name: "Instant Soup",
    ingredients: "Enriched pasta (wheat flour, niacin, iron, thiamine mononitrate, riboflavin, folic acid), salt, monosodium glutamate, partially hydrogenated soybean oil, corn syrup solids, chicken fat, hydrolyzed corn protein, natural flavors, disodium phosphate, yellow 5, yellow 6."
  },
  {
    name: "Gummy Candy",
    ingredients: "Corn syrup, sugar, gelatin, modified corn starch, citric acid, apple juice concentrate, sodium citrate, natural and artificial flavors, coconut oil, red 40, yellow 5, blue 1, carnauba wax."
  }
];

const DEMO_BARCODES = [
  { upc: "012000001126", name: "Coca-Cola Classic", ingredients: "Carbonated water, high fructose corn syrup, caramel color, phosphoric acid, natural flavors, caffeine." },
  { upc: "028400064057", name: "Oreo Cookies", ingredients: "Unbleached enriched flour, sugar, palm oil, cocoa, high fructose corn syrup, leavening, cornstarch, salt, soy lecithin, vanillin, chocolate." },
  { upc: "021000020270", name: "Kraft Mac & Cheese", ingredients: "Enriched macaroni, cheese sauce mix (whey, milkfat, milk protein concentrate, salt, sodium tripolyphosphate, contains less than 2% of citric acid, lactic acid, sodium phosphate, calcium phosphate, with paprika, turmeric, and annatto added for color, enzymes, cheese culture)." },
  { upc: "072830003204", name: "Red Bull Energy", ingredients: "Carbonated water, sucrose, glucose, sodium citrate, taurine, caffeine, inositol, niacinamide, calcium pantothenate, pyridoxine HCl, vitamin B12, natural and artificial flavors, colors." },
  { upc: "030000056127", name: "Lay's Potato Chips", ingredients: "Potatoes, vegetable oil (sunflower, corn, and/or canola oil), salt." }
];

export default function HomePage() {
  const [inputText, setInputText] = useState('');
  const [showSamples, setShowSamples] = useState(false);
  const [showBarcodes, setShowBarcodes] = useState(false);
  const [showOCR, setShowOCR] = useState(false);
  const router = useRouter();

  const handleAnalyze = () => {
    if (!inputText.trim()) {
      // Announce error for screen readers
      const errorMessage = "Please enter ingredients to analyze";
      const errorElement = document.getElementById('input-error');
      if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.setAttribute('aria-live', 'polite');
      }
      return;
    }

    // Clear any previous errors
    const errorElement = document.getElementById('input-error');
    if (errorElement) {
      errorElement.textContent = '';
    }

    // Navigate to results
    const params = new URLSearchParams({ q: inputText });
    router.push(`/results?${params}`);
  };

  const handleSampleSelect = (sample: typeof SAMPLE_INGREDIENTS[0]) => {
    setInputText(sample.ingredients);
    setShowSamples(false);
  };

  const handleBarcodeSelect = (product: typeof DEMO_BARCODES[0]) => {
    setInputText(product.ingredients);
    setShowBarcodes(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Decode Your Food Labels
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
          Instantly understand additives, allergens, and cross-region compliance from any ingredient list. 
          Transparent heuristics, printable reports, no data collection.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Client-only processing</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>NOVA scoring</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Multi-jurisdiction</span>
          </div>
        </div>
      </div>

      {/* Main Input Section */}
      <div className="bg-slate-800 rounded-lg p-8 mb-8">
        <div className="mb-6">
          <label htmlFor="ingredients-input" className="block text-lg font-medium text-white mb-3">
            Paste or type ingredient list
          </label>
          <div 
            id="input-instructions" 
            className="text-sm text-slate-400 mb-4"
          >
            Copy the ingredient list from any food package and paste it here. We'll analyze additives, 
            allergens, and provide regulatory insights for US, California AB 418, and EU markets.
          </div>
          <TextArea
            value={inputText}
            onChange={setInputText}
            placeholder="Ingredients: Water, enriched wheat flour, sugar, palm oil, cocoa powder..."
            rows={6}
          />
          <div 
            id="input-error" 
            className="text-red-400 text-sm mt-2 min-h-[1.25rem]" 
            role="alert"
            aria-live="polite"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <AnalyzeButton 
            onClick={handleAnalyze}
            disabled={!inputText.trim()}
          />

          <button
            type="button"
            onClick={() => setShowSamples(!showSamples)}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors border border-slate-600"
            aria-expanded={showSamples}
            aria-controls="samples-dropdown"
          >
            Try Sample
          </button>

          <button
            type="button"
            onClick={() => setShowBarcodes(!showBarcodes)}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors border border-slate-600"
            aria-expanded={showBarcodes}
            aria-controls="barcode-dropdown"
          >
            Try Barcode
          </button>

          <button
            type="button"
            onClick={() => setShowOCR(!showOCR)}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors border border-slate-600"
            aria-expanded={showOCR}
            aria-controls="ocr-modal"
          >
            📷 Open Camera
          </button>
        </div>

        {/* Sample Dropdown */}
        {showSamples && (
          <div id="samples-dropdown" className="mb-6 p-4 bg-slate-700 rounded-lg">
            <h3 className="text-white font-medium mb-3">Sample Products</h3>
            <div className="grid gap-2">
              {SAMPLE_INGREDIENTS.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => handleSampleSelect(sample)}
                  className="text-left p-3 bg-slate-600 hover:bg-slate-500 rounded transition-colors"
                >
                  <div className="text-white font-medium">{sample.name}</div>
                  <div className="text-slate-300 text-sm truncate">{sample.ingredients}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Barcode Dropdown */}
        {showBarcodes && (
          <div id="barcode-dropdown" className="mb-6 p-4 bg-slate-700 rounded-lg">
            <h3 className="text-white font-medium mb-3">Demo Barcode Lookup</h3>
            <div className="grid gap-2">
              {DEMO_BARCODES.map((product, index) => (
                <button
                  key={index}
                  onClick={() => handleBarcodeSelect(product)}
                  className="text-left p-3 bg-slate-600 hover:bg-slate-500 rounded transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="text-white font-medium">{product.name}</div>
                    <div className="text-slate-400 text-xs font-mono">{product.upc}</div>
                  </div>
                  <div className="text-slate-300 text-sm truncate">{product.ingredients}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* OCR Modal Placeholder */}
        {showOCR && (
          <div className="mb-6 p-4 bg-slate-700 rounded-lg border border-yellow-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium">Camera OCR (Demo)</h3>
              <button
                onClick={() => setShowOCR(false)}
                className="text-slate-400 hover:text-white"
                aria-label="Close camera OCR"
              >
                ✕
              </button>
            </div>
            <div className="bg-slate-800 rounded p-6 text-center">
              <div className="text-yellow-400 mb-2">📷</div>
              <p className="text-slate-300 mb-4">
                OCR feature would capture ingredient text from your camera here.
              </p>
              <div className="text-sm text-slate-400">
                <p>Upload image fallback available for accessibility.</p>
                <p>Would request camera permission in production.</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Help */}
        <div className="text-sm text-slate-400 border-t border-slate-700 pt-4">
          <p className="mb-2">
            <strong>Tips:</strong> Press Ctrl+Enter to analyze • Use "/" to focus search on other pages • Press "?" for help
          </p>
          <p>
            <strong>Privacy:</strong> All analysis happens in your browser. No ingredients are sent to any server.
          </p>
        </div>
      </div>

      {/* Features Preview */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="text-2xl mb-3">•</div>
          <h3 className="text-lg font-semibold text-white mb-2">Instant Analysis</h3>
          <p className="text-slate-400 text-sm">
            NOVA classification, additive flags, allergen detection, and regulatory compliance in seconds.
          </p>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="text-2xl mb-3">§</div>
          <h3 className="text-lg font-semibold text-white mb-2">Compare & Reformulate</h3>
          <p className="text-slate-400 text-sm">
            Side-by-side product comparison and "what-if" scenarios for cleaner formulations.
          </p>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="text-2xl mb-3">◊</div>
          <h3 className="text-lg font-semibold text-white mb-2">Regulatory Timeline</h3>
          <p className="text-slate-400 text-sm">
            See how changing regulations affect your ingredients across US, California, and EU markets.
          </p>
        </div>
      </div>
    </div>
  );
}
