// lib/seoScore.ts
import { Property } from '@prisma/client';

export function computeSeoScore(property: Property): number {
  let score = 0;

  // ── 1. Profile completeness — 40 pts ──────────────────────────────
  const profileFields = [
    property.name,
    property.sector,
    property.area,
    property.street,
    property.phone,
    property.location,
    property.latitude,
    property.longitude,
    property.propertyType,
    property.listingType,
    property.rent,
    property.electricity,
    property.menu,
  ];
  const filledProfile = profileFields.filter(
    (f) => f !== null && f !== undefined && f !== ''
  ).length;
  score += Math.round((filledProfile / profileFields.length) * 40);

  // ── 2. Photo coverage — 12 pts ────────────────────────────────────
  const photos = [
    property.photoRooms,
    property.photoWashroom,
    property.photoKitchen,
    property.photoProperty,
    property.photoWashing,
    property.photoParking,
    property.photoDining,
    property.photoTerrace,
  ];
  const filledPhotos = photos.filter(
    (p) => p !== null && p !== undefined
  ).length;
  score += Math.round((filledPhotos / photos.length) * 12);

  // ── 3. Amenities & food — max 6 pts ──────────────────────────────
  const amenities = [
    property.breakfast,
    property.lunch,
    property.dinner,
    property.housekeeping,
    property.washingMachine,
    property.parking,
    property.kitchen,
  ];
  const amenityCount = amenities.filter(Boolean).length;
  score += Math.min(amenityCount, 6);

  // ── 4. Click engagement — max 25 pts (log scale) ─────────────────
  const clickPts = Math.min(
    Math.round(Math.log10(property.clickCount + 1) * 10),
    25
  );
  score += clickPts;

  // ── 5. Impression reach — max 15 pts (log scale) ─────────────────
  const impPts = Math.min(
    Math.round(Math.log10(property.impressionCount + 1) * 6),
    15
  );
  score += impPts;

  // ── 6. CTR bonus — max 8 pts ─────────────────────────────────────
  if (property.impressionCount > 0) {
    const ctr = property.clickCount / property.impressionCount;
    score += Math.min(Math.round(ctr * 40), 8);
  }

  return Math.min(score, 100);
}