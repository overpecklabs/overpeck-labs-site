/** Server-safe helpers for sample reviews (usable from server-rendered demo pages and client components). */
export type RatedReview = { rating: number };

export const averageRating = (reviews: RatedReview[]) => Math.round((reviews.reduce((a, r) => a + r.rating, 0) / Math.max(1, reviews.length)) * 10) / 10;
