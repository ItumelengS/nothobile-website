'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit2, Trash2, MapPin, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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
  created_at: string;
}

export default function AddressesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);

  const fetchAddresses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('shipping_addresses')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    } else if (user) {
      fetchAddresses();
    }
  }, [user, authLoading, router, fetchAddresses]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const { error } = await supabase
        .from('shipping_addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAddresses(addresses.filter(addr => addr.id !== id));
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      // First, unset all defaults
      await supabase
        .from('shipping_addresses')
        .update({ is_default: false })
        .eq('user_id', user?.id);

      // Then set the new default
      const { error } = await supabase
        .from('shipping_addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;
      
      fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Failed to set default address');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 text-sm text-earth hover:text-amber transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Link>
            <h1 className="text-2xl font-bold text-earth">Shipping Addresses</h1>
          </div>
          
          <button
            onClick={() => {
              setEditingAddress(null);
              setShowForm(true);
            }}
            className="bg-nature text-white px-4 py-2 rounded-md font-medium hover:bg-nature-dark transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Address
          </button>
        </div>

        {showForm ? (
          <AddressForm
            address={editingAddress}
            onSave={() => {
              setShowForm(false);
              fetchAddresses();
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingAddress(null);
            }}
          />
        ) : (
          <>
            {/* Address List */}
            {addresses.length === 0 ? (
              <div className="bg-card border border-earth/20 rounded-lg p-8 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No shipping addresses yet</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="text-nature hover:text-nature-dark underline"
                >
                  Add your first address
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`bg-card border ${
                      address.is_default ? 'border-nature' : 'border-earth/20'
                    } rounded-lg p-4`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Home className="h-4 w-4 text-nature" />
                          <h3 className="font-semibold text-earth">{address.full_name}</h3>
                          {address.is_default && (
                            <span className="bg-nature/20 text-nature text-xs px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-1">{address.phone}</p>
                        <p className="text-sm">
                          {address.street_address}<br />
                          {address.suburb}, {address.city}<br />
                          {address.province}, {address.postal_code}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!address.is_default && (
                          <button
                            onClick={() => handleSetDefault(address.id)}
                            className="text-xs text-nature hover:text-nature-dark"
                          >
                            Set as default
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingAddress(address);
                            setShowForm(true);
                          }}
                          className="p-2 text-earth hover:text-amber transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(address.id)}
                          className="p-2 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Address Form Component
function AddressForm({
  address,
  onSave,
  onCancel,
}: {
  address?: ShippingAddress | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: address?.full_name || '',
    phone: address?.phone || '',
    street_address: address?.street_address || '',
    suburb: address?.suburb || '',
    city: address?.city || '',
    province: address?.province || 'Eastern Cape',
    postal_code: address?.postal_code || '',
    is_default: address?.is_default || false,
  });

  const provinces = [
    'Eastern Cape',
    'Free State',
    'Gauteng',
    'KwaZulu-Natal',
    'Limpopo',
    'Mpumalanga',
    'North West',
    'Northern Cape',
    'Western Cape',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (address) {
        // Update existing address
        const { error } = await supabase
          .from('shipping_addresses')
          .update(formData)
          .eq('id', address.id);

        if (error) throw error;
      } else {
        // Create new address
        const { error } = await supabase
          .from('shipping_addresses')
          .insert([
            {
              ...formData,
              user_id: user?.id,
            },
          ]);

        if (error) throw error;
      }

      onSave();
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-earth/20 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-earth mb-4">
        {address ? 'Edit Address' : 'Add New Address'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-earth mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-3 py-2 border border-earth/30 rounded-md focus:outline-none focus:ring-2 focus:ring-nature/50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-earth mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-earth/30 rounded-md focus:outline-none focus:ring-2 focus:ring-nature/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-earth mb-1">
            Street Address *
          </label>
          <input
            type="text"
            required
            value={formData.street_address}
            onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
            className="w-full px-3 py-2 border border-earth/30 rounded-md focus:outline-none focus:ring-2 focus:ring-nature/50"
            placeholder="123 Main Street"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-earth mb-1">
              Suburb *
            </label>
            <input
              type="text"
              required
              value={formData.suburb}
              onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
              className="w-full px-3 py-2 border border-earth/30 rounded-md focus:outline-none focus:ring-2 focus:ring-nature/50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-earth mb-1">
              City/Town *
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3 py-2 border border-earth/30 rounded-md focus:outline-none focus:ring-2 focus:ring-nature/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-earth mb-1">
              Province *
            </label>
            <select
              required
              value={formData.province}
              onChange={(e) => setFormData({ ...formData, province: e.target.value })}
              className="w-full px-3 py-2 border border-earth/30 rounded-md focus:outline-none focus:ring-2 focus:ring-nature/50"
            >
              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-earth mb-1">
              Postal Code *
            </label>
            <input
              type="text"
              required
              value={formData.postal_code}
              onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              className="w-full px-3 py-2 border border-earth/30 rounded-md focus:outline-none focus:ring-2 focus:ring-nature/50"
              maxLength={4}
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_default}
              onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
              className="rounded border-earth/30"
            />
            <span className="text-sm">Set as default address</span>
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-2 rounded-md font-semibold transition-colors ${
              loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-nature hover:bg-nature-dark text-white'
            }`}
          >
            {loading ? 'Saving...' : 'Save Address'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 border-2 border-earth/30 rounded-md font-semibold hover:bg-earth/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}