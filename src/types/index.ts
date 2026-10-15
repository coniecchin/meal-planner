export type CuisineType = 
  | 'Asian'
  | 'Mediterranean'
  | 'Italian'
  | 'Mexican'
  | 'American'
  | 'Japanese'
  | 'Middle Eastern';

export type DietaryRestriction = 
  | 'High-Protein'
  | 'Low-Carb'
  | 'Gluten-Free'
  | 'Dairy-Free'
  | 'Vegetarian'
  | 'Pescatarian'
  | 'Quick Prep (<30 min)';

export type MealSlot = 'lunch' | 'dinner' | 'breakfast';

export type GroceryCategory = 
  | 'Produce & Herbs'
  | 'Meat & Seafood'
  | 'Dairy & Refrigerated'
  | 'Pantry & Grains'
  | 'Spices & Condiments';

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: GroceryCategory;
  estimatedPrice: number; // in USD
  isPantryStaple?: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  cuisine: CuisineType;
  dietary: DietaryRestriction[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  caloriesPerServing: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  imageUrl: string;
  costPerServing: number;
  ingredients: Ingredient[];
  instructions: string[];
  keyPerishable: string; // Used to compute ingredient overlap & waste reduction
  description: string;
}

export interface PlannedMeal {
  id: string;
  dayIndex: number; // 0 = Mon, 1 = Tue, etc.
  dayName: string;
  slot: MealSlot;
  recipe: Recipe;
  servings: number;
  isSkipped?: boolean; // Eating out or leftovers
}

export interface UserPreferences {
  pax: number;
  plannedDays: number; // 5 or 7
  weeklyBudget: number; // e.g. $120
  cuisines: CuisineType[];
  dietary: DietaryRestriction[];
  preferredGrocer: 'RedMart' | 'GrabMart' | 'FoodPanda' | 'Amazon Fresh' | 'FairPrice';
  deliveryType: 'instant' | 'scheduled';
}

export interface GroceryItemConsolidated {
  id: string;
  name: string;
  totalAmount: number;
  unit: string;
  category: GroceryCategory;
  estimatedPrice: number;
  checked: boolean;
  isInPantry: boolean;
  recipesUsedIn: string[];
}
