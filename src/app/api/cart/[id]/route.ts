import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// PUT /api/cart/[id] - Update cart item quantity
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const { quantity } = await request.json()
    
    if (quantity <= 0) {
      // Delete item if quantity is 0 or less
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', params.id)
      
      if (error) throw error
      
      return NextResponse.json({ message: 'Item removed from cart' })
    }
    
    const { data: cartItem, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', params.id)
      .select(`
        *,
        product:products(*)
      `)
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ cartItem })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 })
  }
}

// DELETE /api/cart/[id] - Remove cart item
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', params.id)
    
    if (error) throw error
    
    return NextResponse.json({ message: 'Item removed from cart' })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to remove cart item' }, { status: 500 })
  }
}