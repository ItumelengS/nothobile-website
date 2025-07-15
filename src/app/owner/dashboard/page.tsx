'use client';

import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { TrendingUp, DollarSign, Package, CheckCircle, XCircle } from 'lucide-react';

export default function OwnerDashboard() {
  const { priceChangeRequests, approvePriceChange, rejectPriceChange } = useAdmin();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock business analytics data
  const analytics = {
    monthlyRevenue: 0,
    growth: 0,
    pendingApprovals: priceChangeRequests.filter(req => req.status === 'pending').length,
    approvedChanges: priceChangeRequests.filter(req => req.status === 'approved').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Owner Dashboard</h1>
        
        {/* Analytics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold">R {analytics.monthlyRevenue}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold">{analytics.growth}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold">{analytics.pendingApprovals}</p>
              </div>
              <Package className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved Changes</p>
                <p className="text-2xl font-bold">{analytics.approvedChanges}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b mb-6">
          <nav className="flex gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('price-approvals')}
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'price-approvals'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Price Approvals
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Business Overview</h2>
              <p className="text-gray-600 mb-4">Welcome to your owner dashboard. Monitor your business performance and approve price changes.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Recent Activity</h3>
                  <p className="text-sm text-gray-600">No recent activity</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Quick Actions</h3>
                  <button className="text-sm text-green-600 hover:text-green-700">
                    View Reports
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'price-approvals' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Price Change Approvals</h2>
              {priceChangeRequests.length === 0 ? (
                <p className="text-gray-600">No price change requests</p>
              ) : (
                <div className="space-y-4">
                  {priceChangeRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{request.productName}</h3>
                          <p className="text-sm text-gray-600">
                            Current: R {request.currentPrice} → Requested: R {request.requestedPrice}
                          </p>
                          <p className="text-xs text-gray-500">
                            Requested by {request.requestedBy} on {request.requestDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status}
                          </span>
                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => approvePriceChange(request.id)}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                              >
                                <CheckCircle className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => rejectPriceChange(request.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <XCircle className="h-5 w-5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Business Analytics</h2>
              <p className="text-gray-600">Analytics and reporting features coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}