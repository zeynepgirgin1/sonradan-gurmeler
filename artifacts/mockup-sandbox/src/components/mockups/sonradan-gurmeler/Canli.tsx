import React from 'react';
import { Heart, MapPin, Plus, BookOpen, Utensils, Coffee, Star, ChefHat } from 'lucide-react';

export function Canli() {
  const places = [
    { name: 'Arca Burger', location: 'İstanbul, Türkiye', icon: <Utensils className="w-8 h-8" />, color: 'bg-rose-100 text-rose-600' },
    { name: 'The Chicken Club', location: 'İstanbul, Türkiye', icon: <ChefHat className="w-8 h-8" />, color: 'bg-amber-100 text-amber-600' },
    { name: 'Grotesk', location: 'İstanbul, Türkiye', icon: <Star className="w-8 h-8" />, color: 'bg-emerald-100 text-emerald-600' },
    { name: 'Poco Nişantaşı', location: 'İstanbul, Türkiye', icon: <Coffee className="w-8 h-8" />, color: 'bg-blue-100 text-blue-600' },
    { name: 'Pioni', location: 'İstanbul, Türkiye', icon: <Utensils className="w-8 h-8" />, color: 'bg-purple-100 text-purple-600' },
    { name: 'Harman Akaretler', location: 'İstanbul, Türkiye', icon: <Coffee className="w-8 h-8" />, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans selection:bg-rose-200">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-rose-600 text-white p-2 rounded-full transform group-hover:scale-110 transition-transform">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-neutral-900">
            Sonradan Gurmeler
          </span>
        </div>
        <nav className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-600 hover:text-rose-600 transition-colors">
            <BookOpen className="w-4 h-4" />
            Günlük
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white text-sm font-semibold rounded-full hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-200 transition-all active:scale-95">
            <Plus className="w-4 h-4" />
            Anı Ekle
          </button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 sm:py-24 space-y-24">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-8">
          <h1 className="font-display font-extrabold text-5xl sm:text-7xl leading-[1.1] text-neutral-900 tracking-tight">
            Hoş geldin, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-700">Sonradan Gurmeler'e</span>
          </h1>
          <p className="font-body text-xl sm:text-2xl text-neutral-500 font-medium leading-relaxed">
            "Seninle yediğim her yemek benim en güzel yemeğim."
          </p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center space-y-3 group hover:-translate-y-1 transition-transform">
            <span className="font-body text-neutral-500 font-medium uppercase tracking-wider text-sm">Gezilen Yerler</span>
            <span className="font-display text-6xl font-bold text-neutral-900 group-hover:text-emerald-500 transition-colors">46</span>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center space-y-3 group hover:-translate-y-1 transition-transform">
            <span className="font-body text-neutral-500 font-medium uppercase tracking-wider text-sm">Dolaşılan Şehirler</span>
            <span className="font-display text-6xl font-bold text-neutral-900 group-hover:text-blue-500 transition-colors">1</span>
          </div>
        </section>

        {/* Son Anılar */}
        <section className="space-y-10">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-4xl font-bold text-neutral-900">Son Anılar</h2>
            <button className="text-rose-600 font-semibold hover:text-rose-700 transition-colors flex items-center gap-1 group">
              Tümünü Gör
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {places.map((place, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full h-[280px]">
                  <div className={"w-16 h-16 rounded-2xl " + place.color + " flex items-center justify-center mb-6"}>
                    {place.icon}
                  </div>
                  <div className="mt-auto space-y-3">
                    <h3 className="font-display text-2xl font-bold text-neutral-900 group-hover:text-rose-600 transition-colors">
                      {place.name}
                    </h3>
                    <div className="flex items-center gap-2 text-neutral-500">
                      <MapPin className="w-4 h-4" />
                      <span className="font-body text-sm font-medium">{place.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-20 px-6 text-center mt-24">
        <div className="max-w-2xl mx-auto space-y-6 flex flex-col items-center">
          <Heart className="w-8 h-8 text-rose-500 fill-current opacity-80" />
          <p className="font-display text-2xl md:text-3xl font-medium text-neutral-300 leading-snug">
            "Seninle yeni yerler keşfetmeyi ve bu güzel anıları paylaşmayı çok seviyorum."
          </p>
        </div>
      </footer>
    </div>
  );
}
