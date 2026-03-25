'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ShoppingBag, Eye, EyeOff, LockOutline } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Parolele nu se potrivesc');
      return;
    }
    setIsLoading(true);
    // TODO: Implement signup logic
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    // TODO: Implement Google Sign In
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-12 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Title */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-white shadow-lg">
            <ShoppingBag size={48} />
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Creează cont
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Începe să economisești astăzi
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-4">
          <div className="space-y-4 rounded-md shadow-sm">
            {/* Email Field */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Mail size={20} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="block w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolă"
                className="block w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-12 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Lock className="opacity-50" size={20} />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmă parola"
                className="block w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-12 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-2xl bg-primary py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Înregistrare'
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <span className="text-sm font-medium text-slate-400">SAU</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-4 text-lg font-bold text-slate-900 shadow-sm transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
          >
            {/* Google Icon Placeholder */}
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
              <span className="text-xs font-black">G</span>
            </div>
            Continuă cu Google
          </button>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-slate-500">
              Ai deja cont?{' '}
              <Link
                href="/login"
                className="font-bold text-primary hover:underline"
              >
                Autentifică-te
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
