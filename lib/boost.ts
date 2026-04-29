// lib/boost.ts
import { prisma } from "@/lib/db";
import { computeSeoScore } from "@/lib/seoScore";
export async function activateBoost(
    propertyId: number,
    durationDays: number = 7,
    multiplier: number = 1.5
  ) {
    const property = await prisma.property.findUniqueOrThrow({
      where: { id: propertyId },
    });
  
    const baseScore = computeSeoScore(property);
    const boostedScore = Math.min(Math.round(baseScore * multiplier), 100);
    const boostEndsAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
  
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        isBoosted: true,
        boostStartedAt: new Date(),
        boostEndsAt,
        boostMultiplier: multiplier,
        boostedSeoScore: boostedScore,
        seoScore: boostedScore,
        seoLastUpdatedAt: new Date(),
      },
    });
  
    return { baseScore, boostedScore, boostEndsAt };
  }