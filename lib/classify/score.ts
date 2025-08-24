import { AdditiveHit } from "@/lib/types";
import { tokenize } from "@/lib/parse/tokenize";
import { canonicalize } from "@/lib/parse/canonicalize";
import { classifyAdditives } from "@/lib/classify/additives";
import { classifyAllergens } from "@/lib/classify/allergens";
import { novaEstimate } from "@/lib/classify/nova";
import { buildJurisdictionRows } from "@/lib/classify/jurisdictions";
import type { Analysis } from "@/lib/store/types";

export function overallScore({ additives, allergens, nova }:{
  additives: { hits: AdditiveHit[] },
  allergens: { hits: { key:string }[] },
  nova: { group: 1|2|3|4 }
}): number {
  let score = 100;
  // Penalize by NOVA group
  score -= (nova.group-1) * 12;
  // Penalize additives by severity
  for (const h of additives.hits) {
    score -= h.severity==="high" ? 15 : h.severity==="med" ? 8 : 4;
  }
  // Allergens reduce score slightly (presence ≠ bad, but caution)
  score -= Math.min(12, allergens.hits.length * 2);
  return Math.max(0, Math.min(100, score));
}

export async function analyzeIngredients(inputText: string): Promise<Analysis> {
  // Tokenize and normalize
  const tokens = tokenize(inputText);
  const normalized = canonicalize(tokens);
  
  // Classify components
  const additiveResult = classifyAdditives(normalized);
  const allergenResult = classifyAllergens(normalized);
  const novaResult = novaEstimate(normalized);
  
  // Build jurisdiction data
  const jurisdictions = buildJurisdictionRows({ hits: additiveResult.hits });
  
  // Calculate overall score
  const score = overallScore({
    additives: additiveResult,
    allergens: allergenResult,
    nova: novaResult
  });

  // Transform to new data structure
  const analysis: Analysis = {
    id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    inputText,
    tokens,
    normalized,
    nova: {
      group: novaResult.group,
      markers: novaResult.markers
    },
    additives: additiveResult.hits.map(hit => {
      // Get jurisdiction status using the same mapping as jurisdictions.ts
      const normalizedKey = hit.key.toLowerCase().replace(/[^a-z0-9]/g, '');
      const jurisdictionStatus = (() => {
        // Simple mapping based on key - this should match the JURISDICTION_STATUS in jurisdictions.ts
        const statusMap: Record<string, { us: string; ca: string; eu: string; }> = {
          "red3": { us: "RESTRICTED", ca: "BANNED", eu: "ALLOWED" },
          "bvo": { us: "RESTRICTED", ca: "BANNED", eu: "BANNED" },
          "potassiumbromate": { us: "ALLOWED", ca: "BANNED", eu: "BANNED" },
          "bha": { us: "ALLOWED", ca: "RESTRICTED", eu: "ALLOWED" },
          "bht": { us: "ALLOWED", ca: "RESTRICTED", eu: "ALLOWED" },
          "tbhq": { us: "ALLOWED", ca: "RESTRICTED", eu: "BANNED" },
          "msg": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
          "hfcs": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" }
        };
        return statusMap[normalizedKey] || { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" };
      })();
      
      return {
        name: hit.display,
        aliases: hit.aliases || [],
        severity: hit.severity === 'high' ? 'high' : hit.severity === 'med' ? 'medium' : 'low',
        category: hit.category || 'Additive',
        description: hit.explainer || 'No description available',
        references: hit.refUrl ? [hit.refUrl] : [],
        jurisdictionStatus: {
          US: { 
            allowed: jurisdictionStatus.us === 'ALLOWED', 
            restricted: jurisdictionStatus.us === 'RESTRICTED', 
            banned: jurisdictionStatus.us === 'BANNED' 
          },
          CA: { 
            allowed: jurisdictionStatus.ca === 'ALLOWED', 
            restricted: jurisdictionStatus.ca === 'RESTRICTED', 
            banned: jurisdictionStatus.ca === 'BANNED' 
          },
          EU: { 
            allowed: jurisdictionStatus.eu === 'ALLOWED', 
            restricted: jurisdictionStatus.eu === 'RESTRICTED', 
            banned: jurisdictionStatus.eu === 'BANNED' 
          }
        }
      };
    }),
    allergens: allergenResult.hits.map(hit => ({
      name: hit.display,
      category: 'Major Allergen',
      confidence: 0.8, // Default confidence
      source: 'Ingredient pattern match'
    })),
    jurisdictions: jurisdictions.map(row => ({
      region: row.display,
      status: {
        allowed: row.us === 'allowed' || row.ca === 'allowed' || row.eu === 'allowed',
        restricted: row.us === 'restricted' || row.ca === 'restricted' || row.eu === 'restricted',
        banned: row.us === 'banned' || row.ca === 'banned' || row.eu === 'banned'
      },
      notes: `US: ${row.us}, CA: ${row.ca}, EU: ${row.eu}`
    })),
    score,
    createdAt: new Date().toISOString()
  };

  return analysis;
}
