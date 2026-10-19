export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  startingPrice?: boolean;
  availability?: "Available" | "Sold Out" | "Made to Order";
  categories?: string[];
  personalizationRequired?: boolean;
  category: string;
  images: string[];
  image_url: string;
  material?: string;
  dimensions?: string;
  leadTime?: string;
  featured?: boolean;
  bestseller?: boolean;
  in_stock?: boolean;
  variants?: ProductVariant[];
  colors?: { name: string; hex: string }[];
  tags?: string[];
  created_at: string;
}
