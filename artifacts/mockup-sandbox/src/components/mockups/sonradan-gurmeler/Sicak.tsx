import React from "react";
import { Heart, MapPin, BookOpen, PenLine, CalendarHeart, Coffee } from "lucide-react";

const places = [
  { name: "Arca Burger", date: "24 Eki 2023", location: "İstanbul, Türkiye" },
  { name: "The Chicken Club", date: "12 Kas 2023", location: "İstanbul, Türkiye" },
  { name: "Grotesk", date: "05 Ara 2023", location: "İstanbul, Türkiye" },
  { name: "Poco Nişantaşı", date: "14 Oca 2024", location: "İstanbul, Türkiye" },
  { name: "Pioni", date: "02 Şub 2024", location: "İstanbul, Türkiye" },
  { name: "Harman Akaretler", date: "18 Mar 2024", location: "İstanbul, Türkiye" },
];

export function Sicak() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4A3B32] selection:bg-[#E8DFD8] selection:text-[#4A3B32]">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');
        .font-serif { font-family: 'Lora', serif; }
      `}} />
      
      {/* Header */}
      <header className="border-b border-[#E8DFD8]/60 bg-[#FAF7F2]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#C05A42]">
            <Heart className="w-5 h-5 fill-current" />
            <span className="font-serif text-xl font-semibold tracking-wide text-[#4A3B32]">Sonradan Gurmeler</span>
          </div>
          <nav className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-[#6D5A4E] hover:text-[#C05A42] transition-colors text-sm font-medium">
              <BookOpen className="w-4 h-4" />
              Günlük
            </button>
            <button className="flex items-center gap-2 bg-[#4A3B32] hover:bg-[#3A2D25] text-[#FAF7F2] px-5 py-2.5 rounded-full transition-colors text-sm font-medium shadow-sm">
              <PenLine className="w-4 h-4" />
              Anı Ekle
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-20">
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-2xl mx-auto mt-8">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#4A3B32] leading-tight">
            Hoş geldin,<br/>
            <span className="italic text-[#C05A42]">Sonradan Gurmeler'e</span>
          </h1>
          <p className="text-lg md:text-xl text-[#6D5A4E] font-serif italic">
            "Seninle yediğim her yemek benim en güzel yemeğim."
          </p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="bg-[#FDFBF7] border border-[#E8DFD8] rounded-2xl p-6 flex items-center gap-5 shadow-[0_2px_10px_rgba(74,59,50,0.03)] hover:shadow-[0_4px_20px_rgba(192,90,66,0.08)] transition-shadow">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8DFD8] flex items-center justify-center text-[#C05A42]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-[#8C7A6D] uppercase tracking-wider font-semibold mb-1">Gezilen Yerler</p>
              <p className="font-serif text-3xl text-[#4A3B32]">46</p>
            </div>
          </div>
          <div className="bg-[#FDFBF7] border border-[#E8DFD8] rounded-2xl p-6 flex items-center gap-5 shadow-[0_2px_10px_rgba(74,59,50,0.03)] hover:shadow-[0_4px_20px_rgba(192,90,66,0.08)] transition-shadow">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8DFD8] flex items-center justify-center text-[#C05A42]">
              <CalendarHeart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-[#8C7A6D] uppercase tracking-wider font-semibold mb-1">Dolaşılan Şehirler</p>
              <p className="font-serif text-3xl text-[#4A3B32]">1</p>
            </div>
          </div>
        </section>

        {/* Recent Memories */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold text-[#4A3B32] flex items-center gap-3">
              Son Anılar
              <span className="h-px bg-[#E8DFD8] flex-1 ml-4 hidden sm:block"></span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place, i) => (
              <div key={i} className="group bg-[#FDFBF7] border border-[#E8DFD8] rounded-2xl p-5 hover:border-[#C05A42]/30 hover:shadow-[0_8px_30px_rgba(192,90,66,0.06)] transition-all cursor-pointer flex flex-col h-full">
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="p-2 rounded-xl bg-[#FAF7F2] text-[#C05A42] group-hover:bg-[#C05A42] group-hover:text-white transition-colors">
                      <Coffee className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-[#8C7A6D] bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#E8DFD8]/50">
                      {place.date}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#4A3B32] group-hover:text-[#C05A42] transition-colors">
                      {place.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-[#8C7A6D] mt-2">
                      <MapPin className="w-3.5 h-3.5" />
                      {place.location}
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E8DFD8]/50 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-semibold text-[#C05A42] uppercase tracking-wide flex items-center gap-1">
                    Anıya Git &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8DFD8] bg-[#FDFBF7] py-12 mt-20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <Heart className="w-6 h-6 mx-auto text-[#C05A42] fill-current opacity-80" />
          <p className="font-serif text-[#6D5A4E] italic text-lg max-w-md mx-auto">
            "Seninle yeni yerler keşfetmeyi ve bu güzel anıları paylaşmayı çok seviyorum."
          </p>
        </div>
      </footer>
    </div>
  );
}