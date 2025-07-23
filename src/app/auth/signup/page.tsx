'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, User, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Sign up the user
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
          },
        },
      });

      if (authError) throw authError;

      // Show success message
      alert('Account created successfully! Please check your email to verify your account.');
      router.push('/auth/login');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Plants - Welcoming Eastern Cape Flora */}
      <div className="fixed inset-0 pointer-events-none opacity-8">
        {/* New growth plants for signup */}
        <div className="absolute top-5 left-5 text-6xl text-nature/25 rotate-10">🌱</div>
        <div className="absolute top-15 right-8 text-5xl text-earth/30 -rotate-20">🌿</div>
        <div className="absolute bottom-15 left-12 text-7xl text-nature/20 rotate-25">🪴</div>
        <div className="absolute bottom-8 right-15 text-6xl text-earth/25 -rotate-15">🌾</div>
        
        {/* Growth symbolism */}
        <div className="absolute top-1/4 right-1/5 text-4xl text-nature/20 rotate-60">🍃</div>
        <div className="absolute bottom-1/4 left-1/5 text-3xl text-earth/25 -rotate-45">🍃</div>
        <div className="absolute top-1/2 left-1/6 text-2xl text-nature/30 rotate-90">🌱</div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-earth hover:text-amber transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Sign Up Form */}
        <div className="bg-card border border-earth/20 rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-earth mb-2">Create Account</h1>
            <p className="text-sm text-muted-foreground">
              Join Nothobile for traditional medicine
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-earth mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-earth/30 rounded-md focus:outline-none focus:ring-2 focus:ring-nature/50"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-earth mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-earth/30 rounded-md focus:outline-none focus:ring-2 focus:ring-nature/50"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Phone (Optional) */}
            <div>
              <label className="block text-sm font-medium text-earth mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-earth/30 rounded-md focus:outline-none focus:ring-2 focus:ring-nature/50"
                  placeholder="+27 12 345 6789"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-earth mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-earth/30 rounded-md focus:outline-none focus:ring-2 focus:ring-nature/50"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-earth mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-earth/30 rounded-md focus:outline-none focus:ring-2 focus:ring-nature/50"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-md font-semibold transition-colors ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-nature hover:bg-nature-dark text-white'
              }`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/auth/login" className="text-nature hover:text-nature-dark font-medium">
              Sign In
            </Link>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p className="mb-2">Benefits of creating an account:</p>
          <ul className="space-y-1">
            <li>✓ Track your orders</li>
            <li>✓ Save your favorites</li>
            <li>✓ Faster checkout</li>
            <li>✓ Order history</li>
          </ul>
        </div>
      </div>
    </div>
  );
}