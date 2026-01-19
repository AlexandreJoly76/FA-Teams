'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Identifiants incorrects. Réessaie, Coach !");
      setLoading(false);
    } else {
      router.push('/');
      router.refresh(); // Rafraîchit pour bien mettre à jour le statut Admin
    }
  };

  return (
    // FOND NOIR CLUB
    <main className="flex min-h-screen items-center justify-center bg-club-black text-white p-4 relative overflow-hidden">
      
      {/* Effet d'arrière plan subtil (Optionnel : un gros cercle vert flou) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-club-green/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* CARTE DE CONNEXION */}
      <form 
        onSubmit={handleLogin} 
        className="relative bg-neutral-900 p-8 rounded-xl shadow-2xl w-full max-w-sm border border-club-gold/30 backdrop-blur-sm"
      >
        {/* Ligne verte décorative en haut */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-club-green to-club-gold"></div>

        <h1 className="text-3xl font-black text-club-green mb-2 text-center uppercase tracking-widest">
          Staff Only
        </h1>
        <p className="text-center text-gray-500 text-xs mb-8 uppercase tracking-wide">
          Espace réservé aux entraineurs
        </p>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded mb-6 text-sm text-center font-bold">
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="block text-xs font-bold text-club-gold uppercase mb-2 tracking-wide">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-neutral-800 text-white border border-neutral-700 rounded p-3 outline-none focus:border-club-green focus:ring-1 focus:ring-club-green transition"
            placeholder="coach@faroumois.fr"
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-xs font-bold text-club-gold uppercase mb-2 tracking-wide">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-neutral-800 text-white border border-neutral-700 rounded p-3 outline-none focus:border-club-green focus:ring-1 focus:ring-club-green transition"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-club-green hover:bg-green-500 text-black font-black uppercase py-3 rounded transition shadow-lg shadow-club-green/20"
        >
          {loading ? 'Connexion...' : 'Accéder au Vestiaire'}
        </button>
        
        <Link href="/" className="block text-center text-gray-500 text-xs mt-6 hover:text-club-gold transition underline decoration-dotted">
          ← Retour au terrain (Visiteur)
        </Link>
      </form>
    </main>
  );
}