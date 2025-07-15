'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PriceChangeRequest {
  id: string;
  productId: number;
  productName: string;
  currentPrice: number;
  requestedPrice: number;
  requestedBy: string;
  requestDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalDate?: Date;
}

interface AdminContextType {
  priceChangeRequests: PriceChangeRequest[];
  loading: boolean;
  requestPriceChange: (productId: number, productName: string, currentPrice: number, newPrice: number) => void;
  approvePriceChange: (requestId: string) => void;
  rejectPriceChange: (requestId: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [priceChangeRequests, setPriceChangeRequests] = useState<PriceChangeRequest[]>([]);
  const [loading] = useState(false);

  const requestPriceChange = (productId: number, productName: string, currentPrice: number, newPrice: number) => {
    const newRequest: PriceChangeRequest = {
      id: Date.now().toString(),
      productId,
      productName,
      currentPrice,
      requestedPrice: newPrice,
      requestedBy: 'admin@nothobile.com', // Would come from auth context in real app
      requestDate: new Date(),
      status: 'pending',
    };

    setPriceChangeRequests(prev => [...prev, newRequest]);
    console.log('Price change requested:', newRequest);
  };

  const approvePriceChange = (requestId: string) => {
    setPriceChangeRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? {
              ...request,
              status: 'approved' as const,
              approvedBy: 'owner@nothobile.com', // Would come from auth context
              approvalDate: new Date(),
            }
          : request
      )
    );
    console.log('Price change approved:', requestId);
  };

  const rejectPriceChange = (requestId: string) => {
    setPriceChangeRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? {
              ...request,
              status: 'rejected' as const,
              approvedBy: 'owner@nothobile.com', // Would come from auth context
              approvalDate: new Date(),
            }
          : request
      )
    );
    console.log('Price change rejected:', requestId);
  };

  return (
    <AdminContext.Provider
      value={{
        priceChangeRequests,
        loading,
        requestPriceChange,
        approvePriceChange,
        rejectPriceChange,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}