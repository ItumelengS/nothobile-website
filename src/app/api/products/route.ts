import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/products - Fetch all products or filter by section
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (section) {
      query = query.eq('section', section)
    }
    
    const { data: products, error } = await query
    
    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }
    
    return NextResponse.json({ products })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/products - Create new product (Admin/Owner only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data: product, error } = await supabase
      .from('products')
      .insert([body])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
    }
    
    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}