import { pgTable, text, serial, timestamp, integer, real, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const placesTable = pgTable("places", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  description: text("description"),
  category: text("category").notNull().default("other"),
  visitedAt: date("visited_at", { mode: "string" }).notNull(),
  photoUrl: text("photo_url"),
  rating: integer("rating"),
  lat: real("lat"),
  lng: real("lng"),
  status: text("status").notNull().default("visited"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPlaceSchema = createInsertSchema(placesTable).omit({ id: true, createdAt: true });
export type InsertPlace = z.infer<typeof insertPlaceSchema>;
export type Place = typeof placesTable.$inferSelect;
