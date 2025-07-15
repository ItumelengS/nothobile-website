import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/cart - Fetch cart items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }
    
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('session_id', sessionId)
    
    if (error) {
      console.error('Error fetching cart:', error)
      return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
    }
    
    return NextResponse.json({ cartItems })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const { productId, quantity = 1, sessionId } = await request.json()
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }
    
    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('session_id', sessionId)
      .eq('product_id', productId)
      .single()
    
    let cartItem
    
    if (existingItem) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select(`
          *,
          product:products(*)
        `)
        .single()
      
      if (error) throw error
      cartItem = data
    } else {
      // Create new cart item
      const { data, error } = await supabase
        .from('cart_items')
        .insert([{
          session_id: sessionId,
          product_id: productId,
          quantity
        }])
        .select(`
          *,
          product:products(*)
        `)
        .single()
      
      if (error) throw error
      cartItem = data
    }
    
    return NextResponse.json({ cartItem }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}

// DELETE /api/cart - Clear cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }
    
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('session_id', sessionId)
    
    if (error) throw error
    
    return NextResponse.json({ message: 'Cart cleared' })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 })
  }
}