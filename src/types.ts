export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  aisle: string; // 'Fresh Produce' | 'Meat & Seafood' | 'Dairy & Chilled' | 'Pantry & Grains' | 'Pantry & Condiments' | 'Bakery' | 'Frozen & Chilled'
  estimatedPrice: number;
  isPantryStaple?: boolean;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTimeMins: number;
  cookTimeMins: number;
  servings: number;
  cuisine: string;
  dietaryTags: string[];
  image: string;
  nutritionPerServing: NutritionInfo;
  ingredients: Ingredient[];
  instructions: string[];
  source?: 'curated' | 'ai_generated' | 'user_uploaded';
}

export interface PantryItem {
  id: string;
  name: string;
  category: string;
  inStock: boolean;
  unit?: string;
  quantityRemaining?: string;
}

export interface GroceryPartner {
  id: 'redmart' | 'grabmart' | 'fairprice' | 'amazon_fresh' | 'foodpanda';
  name: string;
  type: 'instant' | 'scheduled';
  deliveryTime: string;
  minSpend: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  rating: number;
  tagline: string;
  brandColor: string;
  lightBg: string;
}

export interface ConsolidatedCartItem {
  id: string;
  name: string;
  totalQuantity: number;
  unit: string;
  aisle: string;
  estimatedPrice: number;
  usedInRecipes: string[];
  coveredByPantry: boolean;
  quantityToBuy: number;
  isPurchased?: boolean;
}

export interface UserPreferences {
  pax: number;
  days: number;
  budget: number;
  currency: string;
  cuisines: string[];
  dietary: string[];
  allergies: string[];
  cookingTimeTarget: '15-20 mins' | '20-30 mins' | 'Flexible';
  preferredPartner: 'redmart' | 'grabmart' | 'fairprice' | 'amazon_fresh' | 'foodpanda';
}
