'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface JoueurProps {
  id: number;
  nom: string;
  poste: 'GB' | 'JOUEUR';
  x: number;
  y: number;
  estSurLeBanc: boolean;
  onDelete: (id: number) => void;
  onMove: (id: number, percentX: number, percentY: number) => void;
  limitesRef: React.RefObject<HTMLDivElement>;
}

export default function Joueur({ id, nom, poste, x, y, estSurLeBanc, onDelete, onMove, limitesRef }: JoueurProps) {
  
  const elementRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  // NOUVEAU : On stocke les limites calculées (top, left, right, bottom)
  const [constraints, setConstraints] = useState<{ top: number; left: number; right: number; bottom: number } | null>(null);

  const isGB = poste === 'GB';
  const colorPrimary = isGB ? '#C5A22E' : '#00C75B'; 
  const colorSecondary = '#000000'; 
  const bgClass = isGB ? 'bg-[#C5A22E]' : 'bg-[#00C75B]';
  const textClass = 'text-black'; 
  const borderClass = 'border-black/20';
  const PLAYER_SIZE = 56; // w-14 = 56px
  const HALF_SIZE = PLAYER_SIZE / 2; // 28px

  // Reset visuel si les props changent (ex: annuler une action)
  useEffect(() => {
    controls.set({ x: 0, y: 0 });
  }, [x, y, estSurLeBanc, controls]);

  // --- FONCTION MAGIQUE : CALCUL DES LIMITES ---
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation(); // Empêche de drag le terrain si besoin

    if (!limitesRef.current) return;

    // 1. Dimensions du terrain
    const containerRect = limitesRef.current.getBoundingClientRect();
    const W = containerRect.width;
    const H = containerRect.height;

    // 2. Où est le joueur ACTUELLEMENT (en pixels depuis le coin haut/gauche du terrain) ?
    // Formule inverse de ton CSS : center + (width * percentage)
    const currentX = (W / 2) + (W * (x / 100));
    const currentY = (H / 2) + (H * (y / 100));

    // 3. Calcul des murs (Combien de pixels je peux bouger vers la gauche/droite ?)
    // Exemple Gauche : Je peux aller vers la gauche jusqu'à ce que mon bord touche 0.
    // Mon bord gauche est à (currentX - 28). Donc je peux bouger de -(currentX - 28).
    const minLeft = -(currentX - HALF_SIZE); 
    const maxRight = (W - HALF_SIZE) - currentX;
    
    const minTop = -(currentY - HALF_SIZE);
    const maxBottom = (H - HALF_SIZE) - currentY;

    // 4. On applique les contraintes strictes
    setConstraints({
      left: minLeft,
      right: maxRight,
      top: minTop,
      bottom: maxBottom
    });
  };

  return (
    <motion.div
      ref={elementRef}
      drag
      dragMomentum={false} 
      dragElastic={0} // Mur dur (pas d'effet élastique)
      
      // On utilise nos contraintes calculées au lieu de la Ref automatique
      dragConstraints={constraints || undefined}
      
      animate={controls}
      
      className="pointer-events-auto touch-none absolute w-14 h-14 -ml-7 -mt-7 cursor-grab active:cursor-grabbing flex flex-col items-center justify-center"
      style={{ 
        zIndex: 100,
        left: estSurLeBanc ? '50%' : `calc(50% + ${x}%)`, 
        top: estSurLeBanc ? '50%' : `calc(50% + ${y}%)` 
      }}
      
      // Au clic, on calcule immédiatement les murs pour ce drag précis
      onPointerDown={handlePointerDown}

      onDragEnd={() => {
        if (!limitesRef.current || !elementRef.current) return;
        
        // Logique de sauvegarde identique (on garde ta logique qui marche bien)
        const containerRect = limitesRef.current.getBoundingClientRect();
        const playerRect = elementRef.current.getBoundingClientRect();

        const containerCenterX = containerRect.left + containerRect.width / 2;
        const containerCenterY = containerRect.top + containerRect.height / 2;
        const playerCenterX = playerRect.left + playerRect.width / 2;
        const playerCenterY = playerRect.top + playerRect.height / 2;

        const pixelDistanceX = playerCenterX - containerCenterX;
        const pixelDistanceY = playerCenterY - containerCenterY;

        const maxPixelsX = (containerRect.width / 2) - HALF_SIZE;
        const maxPixelsY = (containerRect.height / 2) - HALF_SIZE;

        const safePixelX = Math.max(-maxPixelsX, Math.min(maxPixelsX, pixelDistanceX));
        const safePixelY = Math.max(-maxPixelsY, Math.min(maxPixelsY, pixelDistanceY));

        const percentX = (safePixelX / containerRect.width) * 100;
        const percentY = (safePixelY / containerRect.height) * 100;

        // Reset visuel instantané pour éviter le "Saut"
        controls.set({ x: 0, y: 0 });

        onMove(id, percentX, percentY);
      }}
    >
      
      {!estSurLeBanc && (
        <div className="relative flex flex-col items-center group w-full h-full justify-center">
          <div className="relative drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)] transition-transform group-hover:scale-110 duration-200">
             <MaillotRayuresSVG primary={colorPrimary} secondary={colorSecondary} isGB={isGB} />
             <BoutonSupprimer onClick={() => onDelete(id)} />
          </div>
          <span className="absolute top-full mt-1 text-[10px] font-bold text-white bg-black/80 px-2 py-0.5 rounded-full shadow-md backdrop-blur-sm whitespace-nowrap pointer-events-none border border-white/20 z-20">
            {nom}
          </span>
        </div>
      )}

      {estSurLeBanc && (
        <div className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg shadow-md border ${bgClass} ${borderClass} whitespace-nowrap`}>
           <span className={`text-xs font-black ${textClass} text-center uppercase tracking-wide`}>
             {nom}
           </span>
           <button 
              onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); onDelete(id); }}
              className="ml-1 w-4 h-4 flex items-center justify-center bg-black/20 hover:bg-black/50 rounded-full text-[8px] text-white transition-colors"
            >
              ✕
           </button>
        </div>
      )}

    </motion.div>
  );
}

// ... (Garder MaillotRayuresSVG et BoutonSupprimer en bas du fichier, ils ne changent pas)
const MaillotRayuresSVG = ({ primary, secondary, isGB }: { primary: string, secondary: string, isGB: boolean }) => (
  <svg viewBox="0 0 24 24" className="w-14 h-14" aria-hidden="true" style={{ overflow: 'visible' }}>
    <defs>
      <clipPath id="maillotShape">
        <path d="M20.8 6.6L18.3 4.1C17.9 3.7 17.4 3.5 16.9 3.5H14.5C14.5 3.5 13.8 4.5 12 4.5C10.2 4.5 9.5 3.5 9.5 3.5H7.1C6.6 3.5 6.1 3.7 5.7 4.1L3.2 6.6C2.8 7 2.7 7.6 3 8.1L4.5 11C4.7 11.5 5.2 11.8 5.7 11.7L7 11.4V20C7 20.6 7.4 21 8 21H16C16.6 21 17 20.6 17 20V11.4L18.3 11.7C18.8 11.8 19.3 11.5 19.5 11L21 8.1C21.3 7.6 21.2 7 20.8 6.6Z" />
      </clipPath>
    </defs>
    <path d="M20.8 6.6L18.3 4.1C17.9 3.7 17.4 3.5 16.9 3.5H14.5C14.5 3.5 13.8 4.5 12 4.5C10.2 4.5 9.5 3.5 9.5 3.5H7.1C6.6 3.5 6.1 3.7 5.7 4.1L3.2 6.6C2.8 7 2.7 7.6 3 8.1L4.5 11C4.7 11.5 5.2 11.8 5.7 11.7L7 11.4V20C7 20.6 7.4 21 8 21H16C16.6 21 17 20.6 17 20V11.4L18.3 11.7C18.8 11.8 19.3 11.5 19.5 11L21 8.1C21.3 7.6 21.2 7 20.8 6.6Z" fill={primary} stroke="white" strokeWidth="1" />
    {!isGB && (
      <g clipPath="url(#maillotShape)">
        <rect x="10.5" y="0" width="3" height="24" fill={secondary} />
        <rect x="5.5" y="0" width="2" height="24" fill={secondary} />
        <rect x="16.5" y="0" width="2" height="24" fill={secondary} />
      </g>
    )}
    <path fillOpacity="0.2" fill="black" d="M12 4.5C13.8 4.5 14.5 3.5 14.5 3.5V5C14.5 6.5 13.4 7.5 12 7.5C10.6 7.5 9.5 6.5 9.5 5V3.5C9.5 3.5 10.2 4.5 12 4.5Z" />
  </svg>
);

const BoutonSupprimer = ({ onClick }: { onClick: () => void }) => (
  <button 
    onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); onClick(); }}
    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] border border-white cursor-pointer z-50 shadow-md transition-all hover:scale-125 hover:bg-red-700 opacity-100 sm:opacity-0 group-hover:opacity-100"
  >
    ✕
  </button>
);