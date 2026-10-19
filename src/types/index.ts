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

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  variant?: string;
  color?: string;
  quantity: number;
}

export type CheckoutChannel = "WHATSAPP" | "INSTAGRAM" | "RAZORPAY";

export type OrderStatus = "NEW_INQUIRY" | "PROCESSING" | "HANDCRAFTING" | "SHIPPED" | "DELIVERED";

export type PaymentStatus = "PENDING" | "PAID" | "COD";

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  channel: CheckoutChannel;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  payment_reference?: string;
  created_at: string;
}

export interface CustomOrderRequest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  details: string;
  color_preference?: string;
  budget?: string;
  status: "NEW" | "CONTACTED" | "IN_PROGRESS" | "COMPLETED";
  created_at: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  productName?: string;
  rating: number;
  avatar?: string;
}
