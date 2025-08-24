import { AdditiveRule } from "@/lib/types";

export const ADDITIVES: AdditiveRule[] = [
  {
    key: "red_3",
    display: "Red 3 (Erythrosine)",
    aliases: ["red 3","erythrosine","e127"],
    severity: "high",
    us: "Allowed (subject to color additive regs)",
    ca: "Banned under AB 418 (from Jan 1, 2027)",
    eu: "Restricted/limited use",
    explainer: "Synthetic color linked to policy actions; varies by jurisdiction.",
    refUrl: "https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202320240AB418"
  },
  {
    key: "potassium_bromate",
    display: "Potassium bromate",
    aliases: ["potassium bromate"],
    severity: "high",
    us: "Allowed in some contexts; discouraged",
    ca: "Banned under AB 418 (from Jan 1, 2027)",
    eu: "Banned",
    explainer: "Dough strengthener; banned in EU; California ban effective 2027.",
  },
  {
    key: "propylparaben",
    display: "Propylparaben",
    aliases: ["propyl paraben","propylparaben"],
    severity: "med",
    us: "Allowed (limited)",
    ca: "Banned under AB 418 (from Jan 1, 2027)",
    eu: "Restricted",
    explainer: "Preservative; policy constraints differ by region."
  },
  {
    key: "bvo",
    display: "Brominated vegetable oil (BVO)",
    aliases: ["brominated vegetable oil","bvo"],
    severity: "high",
    us: "FDA revoked food use; effective Aug 2, 2024 (1-year compliance)",
    ca: "Banned under AB 418 (from Jan 1, 2027)",
    eu: "Banned",
    explainer: "Flavor stabilizer; regulatory revocation/ban in multiple regions.",
    refUrl: "https://www.federalregister.gov/"
  },
  {
    key: "titanium_dioxide",
    display: "Titanium dioxide (E171)",
    aliases: ["titanium dioxide","e171","tio2"],
    severity: "med",
    us: "Allowed",
    ca: "Allowed",
    eu: "Banned (since 2022)",
    explainer: "Colorant; EU ban based on EFSA assessment."
  }
];

export function listAdditives(): AdditiveRule[] { return ADDITIVES; }
