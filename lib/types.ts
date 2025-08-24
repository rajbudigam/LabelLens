export type Severity = "low" | "med" | "high";

export interface AdditiveRule {
  key: string;
  display: string;
  aliases: string[];
  severity: Severity;
  us: string;
  ca: string;
  eu: string;
  explainer: string;
  refUrl?: string;
}

export type AdditiveHit = AdditiveRule;

export interface AllergenRule {
  key: string;
  display: string;
  aliases: string[];
}

export type AllergenHit = AllergenRule;

export interface JurisdictionRow {
  key: string;
  display: string;
  us: string;
  ca: string;
  eu: string;
}
