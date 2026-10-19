import type { Product } from "@/types";
export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}
export interface Review {
  id: string;
  author: string;
  quote: string;
  published: boolean;
  permission: boolean;
}
export interface Catalog {
  version: number;
  products: Product[];
  categories: Category[];
  reviews: Review[];
  home: { title: string; subtitle: string; image: string; story: string };
}
export function availability(p: Product) {
  return p.availability || (p.in_stock === false ? "Sold Out" : "Available");
}
export function priceLabel(p: Product) {
  return `${p.startingPrice ? "From " : ""}₹${p.price.toLocaleString("en-IN")}`;
}
