import { useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { 
  useCreatePlace, 
  useUpdatePlace, 
  useGetPlace,
  getListPlacesQueryKey,
  getGetRecentPlacesQueryKey,
  getGetStatsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, MapPin } from "lucide-react";

const PLACE_CATEGORIES = ["restaurant", "cafe", "park", "museum", "beach", "hotel", "bar", "attraction", "other"] as const;
type PlaceCategory = typeof PLACE_CATEGORIES[number];

const CATEGORY_LABELS: Record<PlaceCategory, string> = {
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

const formSchema = z.object({
  name: z.string().min(1, "İsim zorunludur"),
  city: z.string().min(1, "Şehir zorunludur"),
  country: z.string().min(1, "Ülke zorunludur"),
  description: z.string().optional(),
  category: z.enum(PLACE_CATEGORIES),
  photoUrl: z.string().url("Geçerli bir URL giriniz").optional().or(z.literal("")),
  rating: z.coerce.number().min(1).max(5).optional().or(z.literal(0)),
  lat: z.coerce.number().optional().or(z.literal("")),
  lng: z.coerce.number().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export default function PlaceForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id && id !== "new";
  const placeId = parseInt(id || "0", 10);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: place, isLoading: isLoadingPlace } = useGetPlace(placeId, {
    query: {
      enabled: isEdit,
      queryKey: [`/api/places/${placeId}`],
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      city: "",
      country: "",
      description: "",
      category: "other",
      photoUrl: "",
      rating: 0,
      lat: "",
      lng: "",
    },
  });

  useEffect(() => {
    if (place && isEdit) {
      form.reset({
        name: place.name,
        city: place.city,
        country: place.country,
        description: place.description || "",
        category: (place.category as PlaceCategory) || "other",
        photoUrl: place.photoUrl || "",
        rating: place.rating || 0,
        lat: place.lat || "",
        lng: place.lng || "",
      });
    }
  }, [place, isEdit, form]);

  const createMutation = useCreatePlace();
  const updateMutation = useUpdatePlace();

  const onSubmit = (data: FormValues) => {
    const today = format(new Date(), "yyyy-MM-dd");
    const payload = {
      ...data,
      visitedAt: today,
      photoUrl: data.photoUrl || undefined,
      rating: data.rating ? data.rating : undefined,
      lat: data.lat === "" ? undefined : Number(data.lat),
      lng: data.lng === "" ? undefined : Number(data.lng),
    };

    if (isEdit) {
      updateMutation.mutate({ id: placeId, data: payload }, {
        onSuccess: () => {
          toast({ title: "Anı güncellendi." });
          invalidateAndRedirect(`/places/${placeId}`);
        },
        onError: () => toast({ title: "Güncellenemedi", variant: "destructive" })
      });
    } else {
      createMutation.mutate({ data: payload }, {
        onSuccess: (newPlace) => {
          toast({ title: "Yeni anı eklendi!" });
          invalidateAndRedirect(`/places/${newPlace.id}`);
        },
        onError: () => toast({ title: "Eklenemedi", variant: "destructive" })
      });
    }
  };

  const invalidateAndRedirect = (path: string) => {
    queryClient.invalidateQueries({ queryKey: getListPlacesQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetRecentPlacesQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
    setLocation(path);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isEdit && isLoadingPlace) {
    return <div className="p-8 text-center text-muted-foreground">Yükleniyor...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto pb-20 sm:pb-0 animate-in fade-in duration-500">
      <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground" asChild>
        <Link href={isEdit ? `/places/${placeId}` : "/places"}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Geri
        </Link>
      </Button>

      <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-10 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-foreground mb-2">
            {isEdit ? "Anıyı Düzenle" : "Yeni Yer Ekle"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? "Ziyaretin detaylarını güncelle." : "Birlikte keşfettiğin yeri kaydet."}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Yer Adı</FormLabel>
                    <FormControl>
                      <Input placeholder="örn. Küçük Kırmızı Kafe" className="bg-background text-lg py-6" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şehir</FormLabel>
                    <FormControl>
                      <Input placeholder="örn. İstanbul" className="bg-background" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ülke</FormLabel>
                    <FormControl>
                      <Input placeholder="örn. Türkiye" className="bg-background" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Kategori seç" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PLACE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{CATEGORY_LABELS[cat]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Puan (1-5)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} max={5} className="bg-background" {...field} />
                    </FormControl>
                    <FormDescription>Puan vermek istemiyorsan 0 bırak.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anı</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Bu yeri özel kılan ne? Ne yediniz? Nasıl hissettirdi?" 
                      className="min-h-[120px] bg-background resize-y" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border/50 pt-8 mt-8">
              <FormField
                control={form.control}
                name="photoUrl"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Fotoğraf URL</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://..." className="bg-background" {...field} />
                    </FormControl>
                    <FormDescription>Geziden bir fotoğrafın bağlantısı.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2 grid grid-cols-2 gap-6 p-4 bg-muted/50 rounded-xl border border-border/40">
                <div className="col-span-2 flex items-center gap-2 mb-2 text-sm font-medium text-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  Koordinatlar (İsteğe Bağlı)
                </div>
                <FormField
                  control={form.control}
                  name="lat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Enlem</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" placeholder="41.0082" className="bg-background h-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lng"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Boylam</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" placeholder="28.9784" className="bg-background h-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" asChild>
                <Link href={isEdit ? `/places/${placeId}` : "/places"}>Vazgeç</Link>
              </Button>
              <Button type="submit" disabled={isPending} className="min-w-[120px]">
                {isPending ? "Kaydediliyor..." : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> {isEdit ? "Güncelle" : "Kaydet"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
