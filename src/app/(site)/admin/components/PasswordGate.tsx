'use client';

import { useState, useRef, useEffect } from 'react';

interface PasswordGateProps {
  onAuthenticated: (token: string) => void;
}

export default function PasswordGate({ onAuthenticated }: PasswordGateProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        onAuthenticated(password);
      } else {
        setError('Invalid password');
        setPassword('');
        inputRef.current?.focus();
      }
    } catch {
      setError('Connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div
        className="w-full max-w-sm px-8 text-center"
        style={{
          opacity: isMounted ? 1 : 0,
          transform: isMounted ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {/* Logo */}
        <h1
          className="text-2xl font-light tracking-[0.3em] text-black mb-2"
          style={{ letterSpacing: '0.3em' }}
        >
          BORIS HALAS
        </h1>
        <div className="w-8 h-px bg-black mx-auto mb-12" />

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative">
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent border-0 border-b border-gray-200 px-0 py-3 text-center text-sm font-light tracking-widest text-black placeholder-gray-300 focus:outline-none focus:border-black transition-colors duration-500"
              autoComplete="current-password"
              disabled={isLoading}
            />
            {/* Animated focus line */}
            <div
              className="absolute bottom-0 left-1/2 h-px bg-black transition-all duration-500"
              style={{
                width: password ? '100%' : '0%',
                marginLeft: password ? '-50%' : '0',
              }}
            />
          </div>

          {error && (
            <p
              className="text-xs font-light tracking-wider text-red-500"
              style={{
                animation: 'sophisticatedFadeIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="minimal-button w-full px-8 py-3.5 text-xs tracking-[0.15em] uppercase disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span
                  className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full"
                  style={{ animation: 'spin 0.8s linear infinite' }}
                />
                AUTHENTICATING
              </span>
            ) : (
              'ENTER'
            )}
          </button>
        </form>

        <p className="mt-16 text-[10px] font-light tracking-[0.2em] text-gray-300 uppercase">
          Content Management System
        </p>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
