'use client';

import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Package, DollarSign, ShoppingCart, Users } from 'lucide-react';

export default function AdminDashboard() {
  const { requestPriceChange } = useAdmin();
  const [activeTab, setActiveTab] = useState('products');

  // Mock data for demonstration
  const stats = {
    totalProducts: 1,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold">R {stats.totalRevenue}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Customers</p>
                <p className="text-2xl font-bold">{stats.totalCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b mb-6">
          <nav className="flex gap-6">
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'products'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'orders'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('price-changes')}
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'price-changes'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Price Changes
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          {activeTab === 'products' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Product Management</h2>
              <p className="text-gray-600 mb-4">Manage your product inventory and pricing</p>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
                Add New Product
              </button>
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Order Management</h2>
              <p className="text-gray-600">No orders yet</p>
            </div>
          )}
          
          {activeTab === 'price-changes' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Price Change Requests</h2>
              <p className="text-gray-600 mb-4">Request price changes for owner approval</p>
              <button
                onClick={() => requestPriceChange(1, 'Umxube wabantwana', 89.99, 99.99)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Request Sample Price Change
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}