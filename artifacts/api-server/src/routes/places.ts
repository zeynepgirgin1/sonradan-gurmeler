import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { db, placesTable } from "@workspace/db";
import {
  CreatePlaceBody,
  UpdatePlaceBody,
  GetPlaceParams,
  GetPlaceResponse,
  UpdatePlaceParams,
  UpdatePlaceResponse,
  DeletePlaceParams,
  ListPlacesResponse,
  GetRecentPlacesResponse,
  GetStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/places/recent", async (req, res): Promise<void> => {
  const places = await db
    .select()
    .from(placesTable)
    .orderBy(desc(placesTable.visitedAt))
    .limit(6);
  res.json(GetRecentPlacesResponse.parse(places));
});

router.get("/stats", async (_req, res): Promise<void> => {
  const allPlaces = await db.select().from(placesTable);

  const totalPlaces = allPlaces.length;
  const countries = new Set(allPlaces.map((p) => p.country));
  const cities = new Set(allPlaces.map((p) => p.city));

  const categoryCounts: Record<string, number> = {};
  for (const place of allPlaces) {
    categoryCounts[place.category] = (categoryCounts[place.category] ?? 0) + 1;
  }

  const cityFreq: Record<string, number> = {};
  const countryFreq: Record<string, number> = {};
  for (const place of allPlaces) {
    cityFreq[place.city] = (cityFreq[place.city] ?? 0) + 1;
    countryFreq[place.country] = (countryFreq[place.country] ?? 0) + 1;
  }

  const mostVisitedCity =
    Object.entries(cityFreq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const mostVisitedCountry =
    Object.entries(countryFreq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  res.json(
    GetStatsResponse.parse({
      totalPlaces,
      totalCountries: countries.size,
      totalCities: cities.size,
      categoryCounts,
      mostVisitedCity,
      mostVisitedCountry,
    })
  );
});

router.get("/places", async (_req, res): Promise<void> => {
  const places = await db
    .select()
    .from(placesTable)
    .orderBy(desc(placesTable.visitedAt));
  res.json(ListPlacesResponse.parse(places));
});

router.post("/places", async (req, res): Promise<void> => {
  const parsed = CreatePlaceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { visitedAt, ...rest } = parsed.data;
  const visitedAtStr =
    visitedAt instanceof Date
      ? visitedAt.toISOString().split("T")[0]
      : (visitedAt as string);

  const [place] = await db
    .insert(placesTable)
    .values({ ...rest, visitedAt: visitedAtStr })
    .returning();
  res.status(201).json(GetPlaceResponse.parse(place));
});

router.get("/places/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetPlaceParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [place] = await db
    .select()
    .from(placesTable)
    .where(eq(placesTable.id, params.data.id));

  if (!place) {
    res.status(404).json({ error: "Place not found" });
    return;
  }

  res.json(GetPlaceResponse.parse(place));
});

router.patch("/places/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdatePlaceParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdatePlaceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { visitedAt: updateVisitedAt, ...updateRest } = parsed.data;
  const updateVisitedAtStr =
    updateVisitedAt instanceof Date
      ? updateVisitedAt.toISOString().split("T")[0]
      : updateVisitedAt;

  const [place] = await db
    .update(placesTable)
    .set({
      ...updateRest,
      ...(updateVisitedAtStr !== undefined ? { visitedAt: updateVisitedAtStr } : {}),
    })
    .where(eq(placesTable.id, params.data.id))
    .returning();

  if (!place) {
    res.status(404).json({ error: "Place not found" });
    return;
  }

  res.json(UpdatePlaceResponse.parse(place));
});

router.delete("/places/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeletePlaceParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [place] = await db
    .delete(placesTable)
    .where(eq(placesTable.id, params.data.id))
    .returning();

  if (!place) {
    res.status(404).json({ error: "Place not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
