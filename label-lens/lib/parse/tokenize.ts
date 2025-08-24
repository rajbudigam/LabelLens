import { norm } from "@/lib/utils/text";

export function tokenize(input: string): string[] {
  return input
    .replace(/\(|\)|\[|\]/g, " ")
    .split(/[,;]+/g)
    .map(norm)
    .map(s => s.replace(/\s+/g, " "))
    .filter(Boolean);
}
