// Map E-numbers and common variants to canonical strings
const eMap: Record<string,string> = {
  "e127":"erythrosine", "red 3":"erythrosine",
  "e171":"titanium dioxide", "tio2":"titanium dioxide",
  "bvo":"brominated vegetable oil",
};

export function canonicalize(tokens: string[]): string[] {
  return tokens.map(t => {
    const t2 = t.replace(/\b(e[0-9]{3,4})\b/g, (m)=>eMap[m]||m);
    const t3 = Object.entries(eMap).reduce((acc,[k,v])=>acc.replace(new RegExp(`\\b${k}\\b`,"g"), v), t2);
    return t3;
  });
}
