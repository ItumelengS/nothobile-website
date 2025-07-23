'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Plus, CreditCard, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabase';

interface ShippingAddress {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  street_address: string;
  suburb: string;
  city: string;
  province: string;
  postal_code: string;
  is_default: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { cartItems, getTotalAmount, clearCart } = useCart();
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // Cash on Delivery

  const fetchAddresses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('shipping_addresses')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const addressList = data || [];
      setAddresses(addressList);
      
      // Auto-select default address
      const defaultAddress = addressList.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // For guest checkout, redirect to a guest checkout page
        router.push('/checkout/guest');
      } else {
        fetchAddresses();
      }
    }
  }, [user, authLoading, router, fetchAddresses]);

  useEffect(() => {
    // If cart is empty, redirect to cart page
    if (cartItems.length === 0 && !loading) {
      router.push('/cart');
    }
  }, [cartItems, loading, router]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert('Please select a shipping address');
      return;
    }

    setProcessing(true);

    try {
      const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user?.id,
            total_amount: getTotalAmount(),
            status: 'pending',
            customer_email: user?.email,
            customer_name: selectedAddress?.full_name,
            customer_phone: selectedAddress?.phone,
            shipping_address: `${selectedAddress?.street_address}, ${selectedAddress?.suburb}, ${selectedAddress?.city}, ${selectedAddress?.province}, ${selectedAddress?.postal_code}`,
            payment_method: paymentMethod,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();

      // Redirect to order confirmation
      router.push(`/orders/${order.id}/confirmation`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const subtotal = getTotalAmount();
  const shippingFee = 50; // Flat rate shipping
  const total = subtotal + shippingFee;

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Plants - Eastern Cape Traditional Medicine Plants */}
      <div className="fixed inset-0 pointer-events-none opacity-8">
        {/* Traditional healing plants in corners */}
        <div className="absolute -top-12 -left-12 text-7xl text-nature/20 rotate-15">🌿</div>
        <div className="absolute top-5 -right-18 text-6xl text-earth/25 -rotate-20">🪴</div>
        <div className="absolute -bottom-15 -left-18 text-8xl text-nature/15 rotate-30">🌾</div>
        <div className="absolute -bottom-10 -right-15 text-7xl text-earth/20 -rotate-25">🌱</div>
        
        {/* Medicinal herbs scattered */}
        <div className="absolute top-1/5 left-1/6 text-4xl text-nature/20 rotate-45">🍃</div>
        <div className="absolute top-1/2 right-1/4 text-3xl text-earth/25 -rotate-60">🍃</div>
        <div className="absolute bottom-1/3 left-1/3 text-5xl text-nature/15 rotate-75">🌱</div>
        <div className="absolute top-3/4 right-1/6 text-4xl text-earth/20 -rotate-45">🌿</div>
      </div>
      
      <div className="container max-w-6xl mx-auto px-4 py-6 relative z-10">
        {/* Header */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-earth hover:text-amber transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        <h1 className="text-2xl font-bold text-earth mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Shipping & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-card border border-earth/20 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-earth mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </h2>

              {addresses.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">No shipping addresses found</p>
                  <Link
                    href="/profile/addresses"
                    className="inline-flex items-center gap-2 text-nature hover:text-nature-dark"
                  >
                    <Plus className="h-4 w-4" />
                    Add Address
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedAddressId === address.id
                          ? 'border-nature bg-nature/5'
                          : 'border-earth/20 hover:border-earth/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddressId === address.id}
                        onChange={(e) => setSelectedAddressId(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-earth">{address.full_name}</p>
                          <p className="text-sm text-muted-foreground">{address.phone}</p>
                          <p className="text-sm mt-1">
                            {address.street_address}<br />
                            {address.suburb}, {address.city}<br />
                            {address.province}, {address.postal_code}
                          </p>
                        </div>
                        {address.is_default && (
                          <span className="bg-nature/20 text-nature text-xs px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                  
                  <Link
                    href="/profile/addresses"
                    className="inline-flex items-center gap-2 text-sm text-nature hover:text-nature-dark mt-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Address
                  </Link>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-card border border-earth/20 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-earth mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </h2>

              <div className="space-y-3">
                <label className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-nature bg-nature/5'
                    : 'border-earth/20 hover:border-earth/40'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div>
                    <p className="font-medium text-earth">Cash on Delivery</p>
                    <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                  </div>
                </label>

                <label className={`block p-4 border rounded-lg cursor-pointer transition-all opacity-50 cursor-not-allowed`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    disabled
                    className="sr-only"
                  />
                  <div>
                    <p className="font-medium text-earth">Credit/Debit Card</p>
                    <p className="text-sm text-muted-foreground">Coming soon</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="bg-card border border-earth/20 rounded-lg p-6 sticky top-20">
              <h2 className="text-lg font-semibold text-earth mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted-foreground">
                        {item.quantity} x R {item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium">R {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>R {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>R {shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-amber">R {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={processing || !selectedAddressId || addresses.length === 0}
                className={`w-full mt-6 py-3 rounded-md font-semibold transition-colors ${
                  processing || !selectedAddressId || addresses.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-nature hover:bg-nature-dark text-white'
                }`}
              >
                {processing ? 'Processing...' : 'Place Order'}
              </button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}