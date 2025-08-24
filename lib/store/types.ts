// Data contracts for LabelLens app state and persistence

export interface Analysis {
  id: string;
  inputText: string;
  tokens: string[];
  normalized: string[];
  nova: {
    group: number;
    markers: string[];
  };
  additives: AdditiveHit[];
  allergens: AllergenHit[];
  jurisdictions: JurisdictionRow[];
  score: number;
  createdAt: string;
  title?: string;
  tags?: string[];
}

export interface AdditiveHit {
  name: string;
  aliases: string[];
  severity: 'low' | 'medium' | 'high';
  category: string;
  description: string;
  references?: string[];
  jurisdictionStatus: Record<string, JurisdictionStatus>;
}

export interface AllergenHit {
  name: string;
  category: string;
  confidence: number;
  source: string;
}

export interface JurisdictionRow {
  region: string;
  status: JurisdictionStatus;
  effectiveDate?: string;
  notes?: string;
}

export interface JurisdictionStatus {
  allowed: boolean;
  restricted: boolean;
  banned: boolean;
  pendingBan?: string; // ISO date
  notes?: string;
}

export interface UserPreferences {
  region: 'US' | 'CA' | 'EU';
  futureDateISO?: string;
  allergenConcerns: string[];
  a11y: {
    largeText: boolean;
    reducedMotion: boolean;
    highContrast: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

export interface AppSettings {
  version: string;
  analytics: boolean;
  currencyFormat: string;
  autoSave: boolean;
}

export interface SavedAnalysis extends Analysis {
  starred: boolean;
  notes?: string;
}

export interface ComparisonScenario {
  id: string;
  analysisA: Analysis;
  analysisB: Analysis;
  createdAt: string;
  title: string;
}

export interface ReformulationScenario {
  id: string;
  originalAnalysis: Analysis;
  removedIngredients: string[];
  resultingAnalysis: Analysis;
  createdAt: string;
  title: string;
}

export interface FeedbackItem {
  id: string;
  category: 'bug' | 'feature' | 'improvement' | 'question';
  description: string;
  createdAt: string;
  userAgent: string;
  url: string;
}

// Store state interfaces
export interface AnalysisStore {
  current: Analysis | null;
  saved: SavedAnalysis[];
  comparisons: ComparisonScenario[];
  reformulations: ReformulationScenario[];
}

export interface UIStore {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  loading: boolean;
  errors: string[];
  toasts: Toast[];
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// URL encoding helpers
export interface ShareableAnalysis {
  inputText: string;
  region?: string;
  date?: string;
}
