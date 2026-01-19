'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email ou mot de passe incorrect");
    } else {
      // Si c'est bon, on renvoie vers la page principale
      router.push('/');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 text-white p-4">
      <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-sm border border-slate-700">
        <h1 className="text-2xl font-bold text-green-400 mb-6 text-center">Accès Coach ⚽</h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-700 rounded p-2 outline-none focus:ring-2 ring-green-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-slate-400 mb-1">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-700 rounded p-2 outline-none focus:ring-2 ring-green-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded transition"
        >
          Se connecter
        </button>
        
        <Link href="/" className="block text-center text-slate-500 text-xs mt-4 hover:underline">
          Retour au terrain (visiteur)
        </Link>
      </form>
    </main>
  );
}