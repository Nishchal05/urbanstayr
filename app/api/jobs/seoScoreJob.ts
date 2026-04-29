// jobs/seoScoreJob.ts
import cron from 'node-cron';
import { prisma } from '@/lib/db';
import { computeSeoScore } from '@/lib/seoScore';

// Runs every day at 2 AM — checks who needs updating
cron.schedule('0 2 * * *', async () => {
  console.log('[SEO Cron] Starting SEO score refresh...');

  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const now = new Date();

  // ── Step 1: Expire boosts that have ended ──────────────────────────
  const expiredBoosts = await prisma.property.findMany({
    where: {
      isBoosted: true,
      boostEndsAt: { lte: now },
    },
  });

  for (const property of expiredBoosts) {
    const freshScore = computeSeoScore(property);
    await prisma.property.update({
      where: { id: property.id },
      data: {
        isBoosted: false,
        boostStartedAt: null,
        boostEndsAt: null,
        boostedSeoScore: null,
        boostMultiplier: 1.0,
        seoScore: freshScore, // back to real score, no multiplier
        seoLastUpdatedAt: now,
      },
    });
    console.log(`[SEO Cron] Boost expired for property ${property.id}, score reset to ${freshScore}`);
  }

  // ── Step 2: Recalculate scores for properties not updated in 2 days ─
  const staleProperties = await prisma.property.findMany({
    where: {
      OR: [
        { seoLastUpdatedAt: { lte: twoDaysAgo } },
        { seoLastUpdatedAt: null }, // never calculated yet
      ],
    },
  });

  for (const property of staleProperties) {
    const baseScore = computeSeoScore(property);

    // If still actively boosted, keep multiplier applied
    const finalScore = property.isBoosted
      ? Math.min(Math.round(baseScore * property.boostMultiplier), 100)
      : baseScore;

    await prisma.property.update({
      where: { id: property.id },
      data: {
        seoScore: finalScore,
        boostedSeoScore: property.isBoosted ? finalScore : null,
        seoLastUpdatedAt: now,
      },
    });
  }

  console.log(`[SEO Cron] Updated ${staleProperties.length} properties`);
});