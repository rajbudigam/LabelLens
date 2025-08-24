import { AdditiveHit, JurisdictionRow } from "@/lib/types";

// Comprehensive jurisdiction status mapping
const JURISDICTION_STATUS: Record<string, { us: string; ca: string; eu: string; }> = {
  // High-risk additives
  "red3": { us: "RESTRICTED", ca: "BANNED", eu: "ALLOWED" },
  "bvo": { us: "RESTRICTED", ca: "BANNED", eu: "BANNED" },
  "potassiumbromate": { us: "ALLOWED", ca: "BANNED", eu: "BANNED" },
  "bha": { us: "ALLOWED", ca: "RESTRICTED", eu: "ALLOWED" },
  "bht": { us: "ALLOWED", ca: "RESTRICTED", eu: "ALLOWED" },
  "tbhq": { us: "ALLOWED", ca: "RESTRICTED", eu: "BANNED" },
  "azodicarbonamide": { us: "ALLOWED", ca: "BANNED", eu: "BANNED" },
  
  // Color additives
  "red40": { us: "ALLOWED", ca: "ALLOWED", eu: "RESTRICTED" },
  "yellow5": { us: "ALLOWED", ca: "ALLOWED", eu: "RESTRICTED" },
  "yellow6": { us: "ALLOWED", ca: "ALLOWED", eu: "RESTRICTED" },
  "blue1": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "blue2": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "green3": { us: "ALLOWED", ca: "ALLOWED", eu: "BANNED" },
  "caramelcolor": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "titaniumdioxide": { us: "ALLOWED", ca: "ALLOWED", eu: "BANNED" },
  
  // Preservatives
  "sodiumnitrite": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "sodiumnitrate": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "sodiumbenzoate": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "potassiumsorbate": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "calciumdisodiumedta": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "propylgallate": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  
  // Sweeteners
  "hfcs": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "aspartame": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "acesulfamepotassium": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "sucralose": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "saccharin": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "stevia": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  
  // Flavor enhancers
  "msg": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "disodiumguanylate": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "disodiuminosinate": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  
  // Emulsifiers and stabilizers
  "polysorbate80": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "lecithin": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "monoglycerides": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "carrageenan": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "xanthangum": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "guargum": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "gellan": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  
  // Acids and pH regulators
  "citricacid": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "phosphoricacid": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "sodiumphosphates": { us: "ALLOWED", ca: "RESTRICTED", eu: "RESTRICTED" },
  
  // Flavoring agents
  "vanillin": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "naturalflavors": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" },
  "artificialflavors": { us: "ALLOWED", ca: "ALLOWED", eu: "ALLOWED" }
};

export function buildJurisdictionRows(additives: { hits: AdditiveHit[] }): JurisdictionRow[] {
  return additives.hits.map(h => {
    const status = JURISDICTION_STATUS[h.key.toLowerCase().replace(/[^a-z0-9]/g, '')] || 
                  { us: "UNKNOWN", ca: "UNKNOWN", eu: "UNKNOWN" };
    return {
      key: h.key, 
      display: h.display, 
      us: status.us, 
      ca: status.ca, 
      eu: status.eu
    };
  });
}
