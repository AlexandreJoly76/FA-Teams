'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface JoueurProps {
  id: number;
  nom: string;
  numero: string;
  poste: 'GB' | 'JOUEUR';
  x: number;
  y: number;
  onDelete: (id: number) => void;
  onMove: (id: number, deltaX: number, deltaY: number) => void;
}

export default function Joueur({ id, nom, numero, poste, x, y, onDelete, onMove }: JoueurProps) {
  
  const couleurMaillot = poste === 'GB' ? 'bg-yellow-400 text-black' : 'bg-red-600 text-white';

  return (
    <motion.div
      drag
      dragMomentum={false}
      
      // SOLUTION : On enlève "animate" et on passe x/y directement dans le style.
      // Cela évite que Framer Motion essaie d'animer le composant pendant qu'il est déplacé.
      style={{ x: x, y: y, zIndex: 10 }}
      
      onDragEnd={(event, info) => {
        // On met un petit délai (10ms) pour sortir du cycle de rendu immédiat de React
        setTimeout(() => {
             onMove(id, info.offset.x, info.offset.y);
        }, 50);
      }}

      // Bloque le clic pour ne pas interférer avec le terrain
      onPointerDown={(e) => e.stopPropagation()}
      
      className=" touch-none absolute top-1/2 left-1/2 cursor-grab active:cursor-grabbing flex flex-col items-center justify-center w-16 h-16"
    >
      <div className={`relative w-12 h-12 rounded-full border-2 border-white shadow-md flex items-center justify-center font-bold text-lg ${couleurMaillot}`}>
        {numero}
        <button 
          onPointerDown={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute -top-1 -right-1 bg-black text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] hover:bg-red-700 border border-white cursor-pointer"
        >
          ✕
        </button>
      </div>

      <span className="mt-1 text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded shadow-sm backdrop-blur-sm whitespace-nowrap">
        {nom}
      </span>
    </motion.div>
  );
}