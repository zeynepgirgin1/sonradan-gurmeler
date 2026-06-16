import React from 'react';
import { Heart, MapPin, Plus, BookOpen, ChevronRight } from 'lucide-react';

export function Koyu() {
  const places = [
    { name: "Arca Burger", location: "İstanbul, Türkiye", type: "Burger" },
    { name: "The Chicken Club", location: "İstanbul, Türkiye", type: "Fried Chicken" },
    { name: "Grotesk", location: "İstanbul, Türkiye", type: "Bistro" },
    { name: "Poco Nişantaşı", location: "İstanbul, Türkiye", type: "Fine Dining" },
    { name: "Pioni", location: "İstanbul, Türkiye", type: "Dessert & Coffee" },
    { name: "Harman Akaretler", location: "İstanbul, Türkiye", type: "Cocktails & Tapas" },
  ];

  return (
    <div 
      className="min-h-screen flex flex-col font-sans text-neutral-200 selection:bg-[#D4AF37] selection:text-black"
      style={{ backgroundColor: "#080808" }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}} />

      {/* Header */}
      <header className="px-6 py-8 border-b border-[#D4AF37]/20 flex items-center justify-between sticky top-0 bg-[#080808]/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />
          <h1 className="font-serif text-2xl tracking-wide text-white">
            Sonradan Gurmeler
          </h1>
        </div>
        <nav className="flex items-center gap-6 text-sm tracking-widest uppercase">
          <button className="text-neutral-400 hover:text-[#D4AF37] transition-colors flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>Günlük</span>
          </button>
          <button className="border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors px-5 py-2 rounded-none flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Anı Ekle</span>
          </button>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center pt-24 pb-16 px-6 text-center">
        <h2 className="font-serif text-5xl md:text-7xl font-light text-white mb-6 tracking-wide max-w-4xl leading-tight">
          Hoş geldin, <span className="italic text-[#D4AF37]">Sonradan Gurmeler'e</span>
        </h2>
        <p className="text-neutral-400 text-lg md:text-xl font-light tracking-wide max-w-2xl mb-16 italic font-serif">
          "Seninle yediğim her yemek benim en güzel yemeğim."
        </p>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-3xl mb-32">
          <div className="flex-1 border border-[#D4AF37]/20 p-8 flex flex-col items-center justify-center bg-gradient-to-b from-[#111] to-[#080808]">
            <span className="font-serif text-5xl text-[#D4AF37] mb-3">46</span>
            <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">Gezilen Yerler</span>
          </div>
          <div className="flex-1 border border-[#D4AF37]/20 p-8 flex flex-col items-center justify-center bg-gradient-to-b from-[#111] to-[#080808]">
            <span className="font-serif text-5xl text-[#D4AF37] mb-3">1</span>
            <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">Dolaşılan Şehirler</span>
          </div>
        </div>

        {/* Recent Memories */}
        <div className="w-full max-w-6xl text-left">
          <div className="flex items-center justify-between mb-12 border-b border-[#D4AF37]/20 pb-4">
            <h3 className="font-serif text-3xl text-white tracking-wide">Son Anılar</h3>
            <button className="text-sm tracking-widest uppercase text-neutral-500 hover:text-[#D4AF37] transition-colors flex items-center gap-2">
              Tümünü Gör <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {places.map((place, idx) => (
              <div 
                key={idx} 
                className="group cursor-pointer flex flex-col border border-transparent hover:border-[#D4AF37]/30 transition-all duration-500 bg-[#111] overflow-hidden"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] relative overflow-hidden flex items-center justify-center p-8">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
                  <h4 className="font-serif text-3xl text-[#D4AF37]/40 group-hover:text-[#D4AF37]/60 transition-colors text-center italic">
                    {place.name.split(' ')[0]}
                  </h4>
                </div>
                <div className="p-6 flex flex-col flex-1 border-t border-[#D4AF37]/10">
                  <div className="text-[#D4AF37] text-xs uppercase tracking-widest mb-3">
                    {place.type}
                  </div>
                  <h4 className="font-serif text-2xl text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
                    {place.name}
                  </h4>
                  <div className="mt-auto flex items-center gap-2 text-sm text-neutral-500 font-light">
                    <MapPin className="w-3.5 h-3.5" />
                    {place.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-[#D4AF37]/20 text-center px-6">
        <Heart className="w-4 h-4 text-[#D4AF37] mx-auto mb-6" />
        <p className="font-serif text-xl italic text-neutral-400 max-w-md mx-auto">
          "Seninle yeni yerler keşfetmeyi ve bu güzel anıları paylaşmayı çok seviyorum."
        </p>
      </footer>
    </div>
  );
}
