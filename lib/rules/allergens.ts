import { AllergenRule } from "@/lib/types";

export const ALLERGENS: AllergenRule[] = [
  { key:"milk", display:"Milk", aliases:["milk","casein","whey"] },
  { key:"eggs", display:"Eggs", aliases:["egg","albumen"] },
  { key:"fish", display:"Fish", aliases:["fish","salmon","tuna","cod"] },
  { key:"shellfish", display:"Shellfish", aliases:["shrimp","crab","lobster","shellfish"] },
  { key:"tree_nuts", display:"Tree nuts", aliases:["almond","walnut","pecan","hazelnut","pistachio","cashew","brazil nut"] },
  { key:"peanuts", display:"Peanuts", aliases:["peanut","groundnut"] },
  { key:"wheat", display:"Wheat", aliases:["wheat","gluten","flour (wheat)"] },
  { key:"soy", display:"Soy", aliases:["soy","soya","soybean","edamame"] },
  { key:"sesame", display:"Sesame", aliases:["sesame","tahini","benne"] },
];
