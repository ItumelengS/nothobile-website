'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, MapPin, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, userProfile, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || !userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-earth hover:text-amber transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Profile Header */}
        <div className="bg-card border border-earth/20 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-nature/20 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-nature" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-earth">
                {userProfile.full_name || 'Your Profile'}
              </h1>
              <p className="text-sm text-muted-foreground">
                Member since {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{userProfile.email}</span>
            </div>
            {userProfile.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{userProfile.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Eastern Cape, South Africa</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Link
            href="/orders"
            className="bg-card border border-earth/20 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-nature" />
              <div>
                <h3 className="font-semibold text-earth">My Orders</h3>
                <p className="text-xs text-muted-foreground">View order history</p>
              </div>
            </div>
          </Link>

          <Link
            href="/profile/addresses"
            className="bg-card border border-earth/20 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-nature" />
              <div>
                <h3 className="font-semibold text-earth">Shipping Addresses</h3>
                <p className="text-xs text-muted-foreground">Manage delivery locations</p>
              </div>
            </div>
          </Link>

          <Link
            href="/profile/edit"
            className="bg-card border border-earth/20 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-nature" />
              <div>
                <h3 className="font-semibold text-earth">Edit Profile</h3>
                <p className="text-xs text-muted-foreground">Update your information</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Account Actions */}
        <div className="bg-card border border-earth/20 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-earth mb-4">Account Settings</h2>
          
          <div className="space-y-3">
            <button className="text-sm text-nature hover:text-nature-dark">
              Change Password
            </button>
            
            <div className="border-t pt-3">
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Admin/Owner Links */}
        {(userProfile.role === 'admin' || userProfile.role === 'owner') && (
          <div className="mt-6 bg-amber/10 border border-amber/30 rounded-lg p-4">
            <h3 className="font-semibold text-earth mb-2">Admin Access</h3>
            <div className="space-y-2">
              {userProfile.role === 'admin' && (
                <Link
                  href="/admin/dashboard"
                  className="text-sm text-nature hover:text-nature-dark underline"
                >
                  Admin Dashboard →
                </Link>
              )}
              {userProfile.role === 'owner' && (
                <Link
                  href="/owner/dashboard"
                  className="text-sm text-nature hover:text-nature-dark underline"
                >
                  Owner Dashboard →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}