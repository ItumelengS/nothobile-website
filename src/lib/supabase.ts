import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Product {
  id: number
  name: string
  traditional_name: string
  description: string
  base_price: number
  current_price: number
  size: string
  inventory_count: number
  category: string
  section: string
  origin: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: number
  user_id?: string
  session_id?: string
  product_id: number
  quantity: number
  created_at: string
  product?: Product
}

export interface Order {
  id: number
  user_id?: string
  session_id?: string
  total_amount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  customer_email: string
  customer_name: string
  customer_phone?: string
  shipping_address: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  product?: Product
}