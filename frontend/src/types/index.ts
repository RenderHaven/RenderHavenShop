// ─── User & Auth ───────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at?: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default?: boolean;
}

// ─── Category ──────────────────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
  children?: Category[];
}

// ─── Product ───────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  image_url?: string;
  images?: string[];
  items?: Item[];
  created_at?: string;
}

// ─── Item (SKU / Variant) ──────────────────────────────────────────────────
export interface Item {
  id: string;
  product_id: string;
  name: string;
  price: number;
  stock: number;
  image_url?: string;
  variations?: Variation[];
}

// ─── Variation ─────────────────────────────────────────────────────────────
export interface Variation {
  id: string;
  name: string;
  value: string;
}

// ─── Cart ──────────────────────────────────────────────────────────────────
export interface CartItem {
  item: Item;
  product: Product;
  quantity: number;
}

// ─── Order ─────────────────────────────────────────────────────────────────
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  address: Address;
  coupon_code?: string;
  discount?: number;
  created_at: string;
}

// ─── Coupon ────────────────────────────────────────────────────────────────
export interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  valid_from?: string;
  valid_until?: string;
  max_uses?: number;
}

// ─── API Response wrapper ──────────────────────────────────────────────────
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  success: boolean;
}

// ─── Toast ─────────────────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

