import { useState } from "react";
import { Link } from "wouter";
import { useListPlaces } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Search, Image as ImageIcon, Filter } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  all: "Tümü",
  restaurant: "Restoran",
  cafe: "Kafe",
  park: "Park",
  museum: "Müze",
  beach: "Sahil",
  hotel: "Otel",
  bar: "Bar",
  attraction: "Gezilecek Yer",
  other: "Diğer",
};

const PLACE_CATEGORIES = ["restaurant", "cafe", "park", "museum", "beach", "hotel", "bar", "attraction", "other"] as const;

export default function PlacesList() {
  const { data: places, isLoading } = useListPlaces();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = ["all", ...PLACE_CATEGORIES];

  const filteredPlaces = places?.filter(place => {
    const matchesSearch = 
      place.name.toLowerCase().includes(search.toLowerCase()) || 
      place.city.toLowerCase().includes(search.toLowerCase()) ||
      place.country.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || place.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 sm:pb-0 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-4xl font-serif text-foreground mb-2">Günlüğümüz</h1>
          <p className="text-muted-foreground">Birlikte keşfettiğimiz her yer, bir arada.</p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Yer, şehir ara..." 
              className="pl-9 bg-card border-border/60"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mask-edges">
        <Filter className="w-4 h-4 text-muted-foreground mr-1 flex-shrink-0" />
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={categoryFilter === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter(cat)}
            className="capitalize rounded-full whitespace-nowrap"
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-56 w-full rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredPlaces?.length === 0 ? (
        <div className="text-center py-24 bg-card/30 rounded-2xl border border-dashed border-border">
          <p className="text-lg text-muted-foreground mb-4">Filtrelerinize uygun yer bulunamadı.</p>
          {(search || categoryFilter !== "all") && (
            <Button variant="outline" onClick={() => { setSearch(""); setCategoryFilter("all"); }}>
              Filtreleri Temizle
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlaces?.map((place, i) => (
            <Link key={place.id} href={`/places/${place.id}`}>
              <div 
                className="group relative bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full flex flex-col animate-in fade-in zoom-in-95"
                style={{ animationDelay: `${Math.min(i * 50, 500)}ms` }}
              >
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  {place.photoUrl ? (
                    <img 
                      src={place.photoUrl} 
                      alt={place.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accent/20">
                      <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-background/90 backdrop-blur text-xs font-medium px-2 py-1 rounded-md text-foreground capitalize shadow-sm">
                    {CATEGORY_LABELS[place.category] ?? place.category}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-serif mb-1 group-hover:text-primary transition-colors line-clamp-1">{place.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-3 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    {place.city}, {place.country}
                  </p>
                  
                  {place.description && (
                    <p className="text-sm text-muted-foreground/80 line-clamp-2 mb-4 flex-1 font-light">
                      {place.description}
                    </p>
                  )}
                  
                  {place.rating && (
                    <div className="mt-auto pt-3 flex items-center justify-end border-t border-border/40">
                      <div className="flex gap-[1px]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-[11px] ${i < place.rating! ? "text-primary" : "text-muted"}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
