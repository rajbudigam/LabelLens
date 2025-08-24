export function suggestSwaps(tokens: string[]): string[] {
  const txt = tokens.join(" ");
  const out: string[] = [];
  if (/yogurt|yoghurt/.test(txt) && /flavor|color|stabilizer|thickener/.test(txt))
    out.push("Try plain Greek yogurt (milk + live cultures), add real fruit.");
  if (/cereal/.test(txt) && /color|flavor/.test(txt))
    out.push("Look for cereals with whole grains, no artificial colors/flavors.");
  if (/gelatin|candy|gummy/.test(txt) && /red 3|erythrosine/.test(txt))
    out.push("Choose candies colored with fruit/vegetable juices.");
  if (/soda|carbonated water|brominated vegetable oil/.test(txt))
    out.push("Pick sodas without BVO; many brands reformulated.");
  return out.slice(0, 3);
}
