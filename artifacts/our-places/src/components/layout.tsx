import { Link, useLocation } from "wouter";
import { MapPin, Compass, Plus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <span className="font-serif text-xl font-medium tracking-tight text-foreground">Bizim Yerlerimiz</span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-4">
            <Button
              variant={location === "/places" ? "secondary" : "ghost"}
              className="hidden sm:flex"
              asChild
            >
              <Link href="/places">
                <Compass className="w-4 h-4 mr-2" />
                Günlük
              </Link>
            </Button>
            
            <Button asChild className="rounded-full shadow-sm hover:shadow-md transition-all">
              <Link href="/places/new">
                <Plus className="w-4 h-4 mr-1" />
                Anı Ekle
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-border/50 py-10 mt-auto text-center text-muted-foreground space-y-2">
        <p className="font-serif italic text-base text-foreground/70">
          Seninle yeni yerler keşfetmeyi ve bu güzel anıları paylaşmayı çok seviyorum.
        </p>
        <p className="text-xs text-muted-foreground/50">Her yerin anlatacak bir hikayesi var.</p>
      </footer>
      
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 px-6 flex justify-around items-center z-50 pb-safe">
        <Link href="/" className={`flex flex-col items-center p-2 rounded-lg ${location === '/' ? 'text-primary bg-primary/5' : 'text-muted-foreground'}`}>
          <Heart className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Ana Sayfa</span>
        </Link>
        <Link href="/places" className={`flex flex-col items-center p-2 rounded-lg ${location === '/places' ? 'text-primary bg-primary/5' : 'text-muted-foreground'}`}>
          <Compass className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Günlük</span>
        </Link>
        <Link href="/places/new" className={`flex flex-col items-center p-2 rounded-lg ${location === '/places/new' ? 'text-primary bg-primary/5' : 'text-muted-foreground'}`}>
          <Plus className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Ekle</span>
        </Link>
      </div>
    </div>
  );
}
