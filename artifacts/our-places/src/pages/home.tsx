import { useGetStats, useGetRecentPlaces } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Map, Navigation, ArrowRight, Image as ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: recentPlaces, isLoading: placesLoading } = useGetRecentPlaces();

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-16 sm:pb-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="text-center space-y-6 py-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl text-foreground">
          Hoş geldin, <span className="text-primary italic">Sonradan Gurmeler'e</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
          Seninle yediğim her yemek benim en güzel yemeğim.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard 
          icon={<MapPin className="w-6 h-6 text-primary" />}
          title="Gezilen Yerler"
          value={stats?.totalPlaces}
          loading={statsLoading}
        />
        <StatCard 
          icon={<Navigation className="w-6 h-6 text-accent-foreground" />}
          title="Dolaşılan Şehirler"
          value={stats?.totalCities}
          loading={statsLoading}
        />
      </section>

      <section className="space-y-6 pt-8 border-t border-border/50">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl text-foreground">Son Anılar</h2>
            <p className="text-muted-foreground mt-1">Yolculuğumuzun en yeni sayfaları.</p>
          </div>
          <Button variant="ghost" className="hidden sm:flex text-primary hover:text-primary/80" asChild>
            <Link href="/places">
              Tümünü gör <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {placesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : recentPlaces?.length === 0 ? (
          <div className="bg-card border border-border/50 rounded-2xl p-12 text-center shadow-sm">
            <div className="bg-primary/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Map className="w-8 h-8 text-primary/60" />
            </div>
            <h3 className="text-xl font-serif mb-2">Henüz anı yok</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Seyahat günlüğünüz tamamen boş. O güzel kafe ya da birlikte izlediğiniz gün batımını kaydetme vakti!
            </p>
            <Button asChild>
              <Link href="/places/new">İlk Anını Ekle</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPlaces?.map((place, i) => (
              <Link key={place.id} href={`/places/${place.id}`}>
                <div 
                  className="group relative bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
                  style={{ animationDelay: `${i * 100}ms` }}
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
                    <div className="absolute top-3 right-3 bg-background/90 backdrop-blur text-xs font-medium px-2 py-1 rounded-md text-foreground capitalize">
                      {place.category}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-serif mb-1 group-hover:text-primary transition-colors line-clamp-1">{place.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-3">
                      <MapPin className="w-3 h-3" />
                      {place.city}, {place.country}
                    </p>
                    {place.rating && (
                      <div className="mt-auto pt-4 flex items-center justify-end border-t border-border/40">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`text-[10px] ${i < place.rating! ? "text-primary" : "text-muted"}`}>
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
        
        {recentPlaces && recentPlaces.length > 0 && (
          <div className="sm:hidden mt-6 text-center">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/places">Tüm anıları gör</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ icon, title, value, loading }: { icon: React.ReactNode, title: string, value?: number, loading: boolean }) {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
      <div className="bg-background rounded-full p-3 mb-4 shadow-xs">
        {icon}
      </div>
      <h3 className="text-muted-foreground text-sm uppercase tracking-wider mb-1">{title}</h3>
      {loading ? (
        <Skeleton className="h-10 w-16 mt-1" />
      ) : (
        <p className="text-4xl font-serif text-foreground">{value || 0}</p>
      )}
    </div>
  );
}
