import { useParams, Link, useLocation } from "wouter";
import { useGetPlace, useDeletePlace, useUpdatePlace, getListPlacesQueryKey, getGetRecentPlacesQueryKey, getGetStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Edit3, Trash2, ArrowLeft, Image as ImageIcon, Navigation, CheckCircle2, BookmarkIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const CATEGORY_LABELS: Record<string, string> = {
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

export default function PlaceDetail() {
  const { id } = useParams<{ id: string }>();
  const placeId = parseInt(id || "0", 10);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: place, isLoading } = useGetPlace(placeId, {
    query: {
      enabled: !!placeId,
      queryKey: [`/api/places/${placeId}`],
    }
  });

  const deleteMutation = useDeletePlace();
  const updateMutation = useUpdatePlace();

  const handleDelete = () => {
    deleteMutation.mutate({ id: placeId }, {
      onSuccess: () => {
        toast({ title: "Anı silindi" });
        queryClient.invalidateQueries({ queryKey: getListPlacesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetRecentPlacesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        setLocation("/places");
      },
      onError: () => {
        toast({ title: "Silinemedi", variant: "destructive" });
      }
    });
  };

  const handleMarkVisited = () => {
    updateMutation.mutate({ id: placeId, data: { status: "visited" } }, {
      onSuccess: () => {
        toast({ title: "🎉 Gezildi olarak işaretlendi!" });
        queryClient.invalidateQueries({ queryKey: [`/api/places/${placeId}`] });
        queryClient.invalidateQueries({ queryKey: getListPlacesQueryKey() });
      },
      onError: () => {
        toast({ title: "Güncellenemedi", variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-[40vh] w-full rounded-2xl" />
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    );
  }

  if (!place) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h2 className="text-2xl font-serif mb-4">Anı bulunamadı</h2>
        <Button asChild><Link href="/places">Günlüğe Dön</Link></Button>
      </div>
    );
  }

  const isPlanned = place.status === "planned";

  return (
    <div className="max-w-4xl mx-auto pb-20 sm:pb-0 animate-in fade-in duration-500">
      <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground" asChild>
        <Link href="/places">
          <ArrowLeft className="w-4 h-4 mr-2" /> Günlüğe Dön
        </Link>
      </Button>

      <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
        <div className="h-[40vh] md:h-[50vh] bg-muted relative">
          {place.photoUrl ? (
            <img 
              src={place.photoUrl} 
              alt={place.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-accent/10">
              <ImageIcon className="w-16 h-16 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground/50 font-serif italic">Fotoğraf eklenmemiş</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
                {CATEGORY_LABELS[place.category] ?? place.category}
              </span>
              {place.rating && (
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  {place.rating} ★
                </span>
              )}
              {isPlanned ? (
                <span className="bg-amber-400/30 backdrop-blur-md border border-amber-300/40 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                  <BookmarkIcon className="w-3 h-3" /> Gelecek Planı
                </span>
              ) : (
                <span className="bg-emerald-400/30 backdrop-blur-md border border-emerald-300/40 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" /> Gezildi
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-2 leading-tight">
              {place.name}
            </h1>
            <p className="text-white/80 flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5" />
              {place.city}, {place.country}
            </p>
          </div>
        </div>

        <div className="p-6 md:p-10">
          {isPlanned && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-300 text-sm">🔖 Planlandı</p>
                <p className="text-amber-700/70 dark:text-amber-400/70 text-xs mt-0.5">Bu yeri henüz ziyaret etmediniz. Gittiğinizde işaretleyebilirsiniz.</p>
              </div>
              <Button
                size="sm"
                className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white border-0"
                onClick={handleMarkVisited}
                disabled={updateMutation.isPending}
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                {updateMutation.isPending ? "..." : "Gezildi!"}
              </Button>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex-1 space-y-8">
              <div>
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Anı</h3>
                <p className="text-lg text-foreground/90 font-light leading-relaxed whitespace-pre-wrap">
                  {place.description || <span className="italic text-muted-foreground">Bu anı için henüz bir açıklama yazılmamış.</span>}
                </p>
              </div>

              {(place.lat && place.lng) && (
                <div className="pt-6 border-t border-border/40 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Navigation className="w-4 h-4 text-secondary" />
                    {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${place.lat},${place.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                  >
                    <MapPin className="w-4 h-4" />
                    Google Haritalar'da Aç
                  </a>
                </div>
              )}
            </div>

            <div className="md:w-48 space-y-3 border-t md:border-t-0 md:border-l border-border/40 pt-6 md:pt-0 md:pl-8">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/places/${place.id}/edit`}>
                  <Edit3 className="w-4 h-4 mr-2" /> Düzenle
                </Link>
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full justify-start">
                    <Trash2 className="w-4 h-4 mr-2" /> Sil
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Emin misin?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bu anı günlüğünden kalıcı olarak silinecek. Bu işlem geri alınamaz.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      disabled={deleteMutation.isPending}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleteMutation.isPending ? "Siliniyor..." : "Anıyı Sil"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
