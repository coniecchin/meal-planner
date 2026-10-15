import heroCulinaryPrep from './images/hero_culinary_prep_1792051827185.jpg';
import recipeSalmonBowl from './images/recipe_salmon_bowl_1792051827374.jpg';
import recipeThaiCurry from './images/recipe_thai_curry_1792051828102.jpg';
import grocerDeliveryBasket from './images/grocer_delivery_basket_1792051829605.jpg';

export const APP_IMAGES = {
  hero: heroCulinaryPrep,
  salmonBowl: recipeSalmonBowl,
  thaiCurry: recipeThaiCurry,
  grocerBasket: grocerDeliveryBasket,
};

/**
 * Robust image resolver that guarantees a working image URL
 * regardless of whether the URL is an external link, a Vite bundled asset,
 * or a local fallback.
 */
export function resolveImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') {
    return APP_IMAGES.salmonBowl;
  }

  // Valid remote URL (TheMealDB, Unsplash, external CDN)
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }

  // Match keyword to our bundled assets for 100% reliable local resolution
  const lower = url.toLowerCase();
  if (lower.includes('salmon')) {
    return APP_IMAGES.salmonBowl;
  }
  if (lower.includes('curry') || lower.includes('thai')) {
    return APP_IMAGES.thaiCurry;
  }
  if (lower.includes('grocer') || lower.includes('basket') || lower.includes('delivery')) {
    return APP_IMAGES.grocerBasket;
  }
  if (lower.includes('hero') || lower.includes('prep') || lower.includes('kitchen') || lower.includes('pasta')) {
    return APP_IMAGES.hero;
  }

  // Default to bundled salmon bowl
  return APP_IMAGES.salmonBowl;
}
