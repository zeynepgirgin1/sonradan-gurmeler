import { useEffect, useRef, useState } from "react";
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
import { ArrowLeft, Save, MapPin, Upload, X, ImageIcon } from "lucide-react";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";

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

const PLACE_STATUSES = ["visited", "planned"] as const;
type PlaceStatus = typeof PLACE_STATUSES[number];

const formSchema = z.object({
  name: z.string().min(1, "İsim zorunludur"),
  city: z.string().min(1, "Şehir zorunludur"),
  country: z.string().min(1, "Ülke zorunludur"),
  description: z.string().optional(),
  category: z.enum(PLACE_CATEGORIES),
  photoUrl: z.string().optional().or(z.literal("")),
  rating: z.coerce.number().min(1).max(5).optional().or(z.literal(0)),
  lat: z.coerce.number().optional().or(z.literal("")),
  lng: z.coerce.number().optional().or(z.literal("")),
  status: z.enum(PLACE_STATUSES),
});

type FormValues = z.infer<typeof formSchema>;

export default function PlaceForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id && id !== "new";
  const placeId = parseInt(id || "0", 10);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
      status: "visited" as PlaceStatus,
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
        status: (place.status as PlaceStatus) || "visited",
      });
      if (place.photoUrl) {
        setPreviewUrl(place.photoUrl);
      }
    }
  }, [place, isEdit, form]);

  const { uploadFile, isUploading, progress } = useCloudinaryUpload({
    onSuccess: (url) => {
      form.setValue("photoUrl", url);
      toast({ title: "Fotoğraf yüklendi!" });
    },
    onError: () => {
      toast({ title: "Fotoğraf yüklenemedi", variant: "destructive" });
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    await uploadFile(file);
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    form.setValue("photoUrl", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Durum</FormLabel>
                    <FormControl>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => field.onChange("visited")}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            field.value === "visited"
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-background text-muted-foreground hover:border-primary/40"
                          }`}
                        >
                          <span className="text-base">✅</span> Gezildi
                        </button>
                        <button
                          type="button"
                          onClick={() => field.onChange("planned")}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            field.value === "planned"
                              ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                              : "border-border bg-background text-muted-foreground hover:border-amber-400/40"
                          }`}
                        >
                          <span className="text-base">🔖</span> Gelecek Planı
                        </button>
                      </div>
                    </FormControl>
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
              <div className="md:col-span-2">
                <label className="text-sm font-medium leading-none mb-3 block">Fotoğraf</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {previewUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-muted/30">
                    <img
                      src={previewUrl}
                      alt="Fotoğraf önizlemesi"
                      className="w-full max-h-64 object-cover"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 bg-background/70 flex flex-col items-center justify-center gap-2">
                        <div className="text-sm font-medium text-foreground">Yükleniyor... %{progress}</div>
                        <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {!isUploading && (
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="h-8 px-3 text-xs shadow-md"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-3 h-3 mr-1.5" /> Değiştir
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0 shadow-md"
                          onClick={handleRemovePhoto}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-3 py-10 rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">Fotoğraf yükle</p>
                      <p className="text-xs text-muted-foreground mt-1">Galeriden veya kameradan seç</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                      <Upload className="w-4 h-4" /> Dosya Seç
                    </div>
                  </button>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  Telefonundan veya bilgisayarından fotoğraf yükleyebilirsin.
                </p>
              </div>

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
              <Button type="submit" disabled={isPending || isUploading} className="min-w-[120px]">
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
