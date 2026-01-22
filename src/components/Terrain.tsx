import React, { forwardRef } from 'react';
import Image from 'next/image';

interface TerrainProps {
  children?: React.ReactNode;
}

const Terrain = forwardRef<HTMLDivElement, TerrainProps>(({ children }, ref) => {
  return (
    <div 
      ref={ref}
      className="relative w-87.5 h-125 sm:w-112.5 sm:h-150 border-4 border-white/90 rounded-lg shadow-2xl bg-neutral-800"
    >
      
      {/* PELOUSE */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden rounded-[inherit] z-0"
        style={{
          background: 'repeating-linear-gradient(180deg, #1a4d2e 0%, #1a4d2e 10%, #144026 10%, #144026 20%)'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
          <Image src="/logo.png" alt="Logo Club" width={192} height={192} className="object-contain opacity-50 grayscale contrast-125" />
        </div>

        {/* LIGNES */}
        <div className="absolute top-1/2 w-full h-0.5 bg-white/70 -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/70 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 left-1/2 w-40 h-20 border-b-2 border-l-2 border-r-2 border-white/70 -translate-x-1/2"></div>
        <div className="absolute top-20 left-1/2 w-20 h-10 border-b-2 border-l-2 border-r-2 border-white/70 rounded-b-full -translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-40 h-20 border-t-2 border-l-2 border-r-2 border-white/70 -translate-x-1/2"></div>
        <div className="absolute bottom-20 left-1/2 w-20 h-10 border-t-2 border-l-2 border-r-2 border-white/70 rounded-t-full -translate-x-1/2"></div>
        <div className="absolute top-0 left-0 w-6 h-6 border-b-2 border-r-2 border-white/70 rounded-br-full"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-b-2 border-l-2 border-white/70 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-t-2 border-r-2 border-white/70 rounded-tr-full"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-t-2 border-l-2 border-white/70 rounded-tl-full"></div>
      </div>
      
      {/* JOUEURS */}
      <div className="relative w-full h-full z-10">
        {children}
      </div>
    </div>
  );
});

Terrain.displayName = 'Terrain';

export default Terrain;