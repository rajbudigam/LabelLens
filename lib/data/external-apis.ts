// External API integrations for comprehensive food data

export interface FDAAdditiveData {
  name: string;
  eNumber?: string;
  status: 'GRAS' | 'FDA_APPROVED' | 'BANNED' | 'RESTRICTED';
  description: string;
  uses: string[];
  concerns?: string[];
}

export interface USDANutrientData {
  fdcId: number;
  description: string;
  nutrients: Array<{
    nutrientId: number;
    nutrientName: string;
    value: number;
    unitName: string;
  }>;
}

// USDA Food Data Central API
export async function searchUSDADatabase(query: string): Promise<USDANutrientData[]> {
  const API_KEY = process.env.USDA_API_KEY || 'DEMO_KEY';
  const response = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.foods || [];
}

// Open Food Facts API (extensive additive database)
export async function searchOpenFoodFacts(barcode?: string, query?: string) {
  let url = 'https://world.openfoodfacts.org/api/v0/';
  
  if (barcode) {
    url += `product/${barcode}.json`;
  } else if (query) {
    url += `search?search_terms=${encodeURIComponent(query)}&fields=additives,ingredients,nutrition_grades`;
  }
  
  const response = await fetch(url);
  return response.json();
}

// FDA Color Additive Database
export const FDA_COLOR_ADDITIVES = [
  {
    name: "FD&C Blue No. 1",
    eNumber: "E133",
    status: "FDA_APPROVED",
    restrictions: "Good Manufacturing Practice limits",
    concerns: ["Hyperactivity in children", "Allergic reactions"]
  },
  {
    name: "FD&C Blue No. 2", 
    eNumber: "E132",
    status: "FDA_APPROVED",
    restrictions: "Good Manufacturing Practice limits",
    concerns: ["Brain tumors in animal studies", "Nerve transmission effects"]
  },
  {
    name: "FD&C Green No. 3",
    eNumber: "E143", 
    status: "FDA_APPROVED",
    restrictions: "Ingested drugs and cosmetics only",
    concerns: ["Bladder cancer in animal studies", "Banned in EU"]
  },
  {
    name: "FD&C Red No. 3",
    eNumber: "E127",
    status: "RESTRICTED", 
    restrictions: "Banned in cosmetics, limited in foods",
    concerns: ["Thyroid tumors", "Hyperactivity", "Endocrine disruption"]
  },
  {
    name: "FD&C Red No. 40",
    eNumber: "E129",
    status: "FDA_APPROVED",
    restrictions: "Good Manufacturing Practice limits", 
    concerns: ["Hyperactivity in children", "Cancer in animal studies"]
  },
  {
    name: "FD&C Yellow No. 5",
    eNumber: "E102",
    status: "FDA_APPROVED",
    restrictions: "Must be labeled if present",
    concerns: ["Hyperactivity", "Asthma", "Allergic reactions"]
  },
  {
    name: "FD&C Yellow No. 6",
    eNumber: "E110", 
    status: "FDA_APPROVED",
    restrictions: "Good Manufacturing Practice limits",
    concerns: ["Hyperactivity", "Carcinogenic contaminants", "Allergies"]
  }
];

// EU Food Safety Authority Database
export const EFSA_RESTRICTED_ADDITIVES = [
  {
    eNumber: "E171",
    name: "Titanium Dioxide",
    euStatus: "BANNED",
    effectiveDate: "2022-08-07",
    reason: "Cannot rule out genotoxicity concerns"
  },
  {
    eNumber: "E216", 
    name: "Propyl 4-hydroxybenzoate",
    euStatus: "BANNED",
    effectiveDate: "2006-01-01", 
    reason: "Endocrine disruption concerns"
  },
  {
    eNumber: "E924",
    name: "Potassium bromate", 
    euStatus: "BANNED",
    effectiveDate: "1990s",
    reason: "Carcinogenic properties"
  }
];

export async function getComprehensiveAdditiveData(additiveName: string) {
  // Combine multiple data sources for complete picture
  const [usdaData, openFoodData] = await Promise.all([
    searchUSDADatabase(additiveName),
    searchOpenFoodFacts(undefined, additiveName)
  ]);
  
  return {
    usda: usdaData,
    openFood: openFoodData,
    fdaColorStatus: FDA_COLOR_ADDITIVES.find(a => 
      a.name.toLowerCase().includes(additiveName.toLowerCase()) ||
      a.eNumber.toLowerCase().includes(additiveName.toLowerCase())
    ),
    euStatus: EFSA_RESTRICTED_ADDITIVES.find(a =>
      a.name.toLowerCase().includes(additiveName.toLowerCase())
    )
  };
}
