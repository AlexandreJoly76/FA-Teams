'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { toPng } from 'html-to-image';
import Terrain from '@/components/Terrain';
import Joueur from '@/components/Joueur';
import { supabase } from '@/lib/supabaseClient';

// --- TYPES ---
interface Player {
  id: number;
  nom: string;
  prenom: string;
  categorie: string;
  numero: string;
  poste: 'GB' | 'JOUEUR';
  x: number;
  y: number;
}

export default function Home() {
  // --- STATES ---
  const [joueurs, setJoueurs] = useState<Player[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [categorieActuelle, setCategorieActuelle] = useState('Seniors A');
  const categoriesDispo = ['Seniors A', 'Seniors B', 'Seniors 31','U15-U14', 'U13-U12','U13-U12 2','U7','U9','U11'];

  // Formulaire
  const [nouveauNom, setNouveauNom] = useState('');
  const [nouveauPrenom, setNouveauPrenom] = useState('');
  const [nouveauNumero, setNouveauNumero] = useState('');
  const [nouveauPoste, setNouveauPoste] = useState<'GB' | 'JOUEUR'>('JOUEUR');

  const terrainRef = useRef<HTMLDivElement>(null);

  // --- 1. AUTH ---
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdmin(!!session);
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    window.location.reload();
  };

  // --- 2. CHARGEMENT ---
  useEffect(() => {
    const chargerJoueurs = async () => {
      setIsLoaded(false);
      const { data, error } = await supabase
        .from('joueurs')
        .select('*')
        .eq('categorie', categorieActuelle);

      if (error) console.error("Erreur chargement:", error);
      else if (data) setJoueurs(data as Player[]);
      setIsLoaded(true);
    };
    chargerJoueurs();
  }, [categorieActuelle]);

  // --- 3. ACTIONS ---
  const ajouterJoueur = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nouveauNom.trim()) return;

    const nouveauJoueur = {
      nom: nouveauNom,
      prenom: nouveauPrenom,
      numero: nouveauNumero,
      poste: nouveauPoste,
      categorie: categorieActuelle,
      x: 0,
      y: 0
    };

    const { data, error } = await supabase.from('joueurs').insert([nouveauJoueur]).select();

    if (error) alert("Erreur ajout");
    else if (data) {
      setJoueurs([...joueurs, data[0] as Player]);
      setNouveauNom(''); setNouveauPrenom(''); setNouveauNumero(''); setNouveauPoste('JOUEUR');
    }
  };

  const supprimerJoueur = async (id: number) => {
    setJoueurs(joueurs.filter((j) => j.id !== id));
    await supabase.from('joueurs').delete().eq('id', id);
  };

  const deplacerJoueur = async (id: number, deltaX: number, deltaY: number) => {
    const joueursMisAJour = joueurs.map(j => {
      if (j.id === id) return { ...j, x: j.x + deltaX, y: j.y + deltaY };
      return j;
    });
    setJoueurs(joueursMisAJour);
    const joueurBouge = joueursMisAJour.find(j => j.id === id);
    if (joueurBouge) {
      await supabase.from('joueurs').update({ x: joueurBouge.x, y: joueurBouge.y }).eq('id', id);
    }
  };

  const telechargerImage = async () => {
    if (!terrainRef.current) return;
    try {
      const dataUrl = await toPng(terrainRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `compo-${categorieActuelle}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) { console.error("Erreur export:", err); }
  };

  // --- RENDU AUX COULEURS DU CLUB ---
  return (
    // Fond NOIR CLUB
    <main className="flex min-h-screen flex-col items-center p-4 bg-club-black text-white gap-6 relative">
      
      {/* BOUTON CONNEXION */}
      <div className="absolute top-4 right-4 z-50">
        {isAdmin ? (
          <button onClick={handleLogout} className="text-red-500 text-xs font-bold border border-red-900 bg-red-900/20 px-3 py-1 rounded-full hover:bg-red-900/40 transition">
            Se déconnecter
          </button>
        ) : (
          <Link href="/login" className="text-club-green text-xs font-bold border border-club-green bg-club-green/10 px-3 py-1 rounded-full hover:bg-club-green/20 transition">
            Accès Coach
          </Link>
        )}
      </div>

      {/* TITRE EN VERT CLUB */}
      <h1 className="text-3xl font-black text-club-green mt-4 uppercase tracking-wider drop-shadow-md">
        FA Roumois
      </h1>

      {/* SÉLECTEUR AVEC BORDURE DORÉE */}
      <div className="flex items-center gap-4 bg-neutral-900 p-2 rounded-lg border border-club-gold shadow-[0_0_10px_rgba(197,162,46,0.2)]">
        <span className="text-club-gold font-bold text-sm uppercase">Équipe</span>
        <select 
          value={categorieActuelle}
          onChange={(e) => setCategorieActuelle(e.target.value)}
          className="bg-neutral-800 text-white font-bold py-1 px-3 rounded outline-none border border-neutral-700 focus:border-club-green text-sm"
        >
          {categoriesDispo.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* FORMULAIRE ADMIN (Fond sombre + Touche verte) */}
      {isAdmin && (
        <form onSubmit={ajouterJoueur} className="flex flex-wrap gap-2 items-end justify-center bg-neutral-900 p-4 rounded-lg shadow-lg border border-club-green/50">
            <div className="flex flex-col">
                <label className="text-[10px] text-gray-400 uppercase">Nom</label>
                <input type="text" placeholder="Nom" value={nouveauNom} onChange={(e) => setNouveauNom(e.target.value)} className="px-2 py-1 w-24 rounded bg-white text-black text-sm outline-none focus:ring-2 ring-club-green" />
            </div>
            <div className="flex flex-col">
                <label className="text-[10px] text-gray-400 uppercase">Prénom</label>
                <input type="text" placeholder="Prénom" value={nouveauPrenom} onChange={(e) => setNouveauPrenom(e.target.value)} className="px-2 py-1 w-24 rounded bg-white text-black text-sm outline-none focus:ring-2 ring-club-green" />
            </div>
            <div className="flex flex-col">
                <label className="text-[10px] text-gray-400 uppercase">N°</label>
                <input type="number" placeholder="10" value={nouveauNumero} onChange={(e) => setNouveauNumero(e.target.value)} className="px-2 py-1 w-12 rounded bg-white text-black text-sm outline-none focus:ring-2 ring-club-green" />
            </div>
            <div className="flex flex-col">
                <label className="text-[10px] text-gray-400 uppercase">Poste</label>
                <select value={nouveauPoste} onChange={(e) => setNouveauPoste(e.target.value as 'GB' | 'JOUEUR')} className="px-2 py-1 rounded bg-white text-black text-sm cursor-pointer outline-none focus:ring-2 ring-club-green">
                    <option value="JOUEUR">Joueur</option>
                    <option value="GB">Gardien</option>
                </select>
            </div>
            {/* Bouton VERT CLUB */}
            <button type="submit" className="bg-club-green hover:bg-green-500 text-black px-3 py-1 rounded font-bold transition text-sm h-7">+</button>
        </form>
      )}

      {/* Bouton Téléchargement DORÉ */}
      <button onClick={telechargerImage} className="text-club-gold text-sm hover:text-yellow-200 underline flex items-center gap-1 font-bold">
        📸 Télécharger la compo
      </button>

      {/* TERRAIN */}
      <div className="p-1 border-2 border-club-gold rounded-xl bg-neutral-800 relative shadow-2xl">
          {!isLoaded && (
            <div className="absolute inset-0 bg-club-black/90 z-20 flex items-center justify-center text-club-green font-bold rounded-xl animate-pulse">
              Chargement...
            </div>
          )}
          <Terrain ref={terrainRef}>
            {joueurs.map((joueur) => (
              <Joueur 
                key={joueur.id} 
                id={joueur.id} 
                nom={`${joueur.nom} ${joueur.prenom ? joueur.prenom.charAt(0)+'.' : ''}`}
                numero={joueur.numero}
                poste={joueur.poste}
                x={joueur.x}
                y={joueur.y}
                onDelete={isAdmin ? supprimerJoueur : () => {}} 
                onMove={isAdmin ? deplacerJoueur : () => {}}
              />
            ))}
          </Terrain>
      </div>

      {!isAdmin && (
        <p className="text-gray-600 text-xs">Mode visiteur</p>
      )}
    </main>
  );
}