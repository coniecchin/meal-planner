import { GroceryCategory, GroceryItemConsolidated, PlannedMeal, Recipe, UserPreferences } from '../types';
import { INITIAL_RECIPES } from '../data/recipes';

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function generateDefaultPlan(preferences: UserPreferences): PlannedMeal[] {
  const count = preferences.plannedDays;
  const meals: PlannedMeal[] = [];
  
  // Pick recipes that fit dietary and cuisine if possible, with shared key perishables to reduce waste
  let pool = INITIAL_RECIPES.filter(r => {
    // If user has specific dietary filters
    if (preferences.dietary.length > 0) {
      const matchesDiet = preferences.dietary.some(d => r.dietary.includes(d));
      if (!matchesDiet) return false;
    }
    return true;
  });

  if (pool.length < count) {
    pool = INITIAL_RECIPES;
  }

  // Pick recipes, prioritizing those that share ingredients
  for (let i = 0; i < count; i++) {
    const recipeIndex = i % pool.length;
    const recipe = pool[recipeIndex];
    meals.push({
      id: `meal-${i}-${Date.now()}`,
      dayIndex: i,
      dayName: DAY_NAMES[i],
      slot: 'dinner',
      recipe,
      servings: preferences.pax,
      isSkipped: false,
    });
  }

  return meals;
}

export function consolidateGroceryList(
  plannedMeals: PlannedMeal[],
  pax: number,
  existingPantryIds: Set<string> = new Set()
): GroceryItemConsolidated[] {
  const map = new Map<string, GroceryItemConsolidated>();

  plannedMeals.forEach(meal => {
    if (meal.isSkipped) return;
    const scaleFactor = meal.servings / meal.recipe.servings;

    meal.recipe.ingredients.forEach(ing => {
      const key = `${ing.name.toLowerCase().trim()}_${ing.unit.toLowerCase().trim()}`;
      const scaledAmount = Math.round(ing.amount * scaleFactor * 10) / 10;
      const scaledPrice = Math.round(ing.estimatedPrice * scaleFactor * 100) / 100;

      if (map.has(key)) {
        const existing = map.get(key)!;
        existing.totalAmount = Math.round((existing.totalAmount + scaledAmount) * 10) / 10;
        existing.estimatedPrice = Math.round((existing.estimatedPrice + scaledPrice) * 100) / 100;
        if (!existing.recipesUsedIn.includes(meal.recipe.title)) {
          existing.recipesUsedIn.push(meal.recipe.title);
        }
      } else {
        const id = `item-${key.replace(/[^a-z0-9]/g, '-')}`;
        map.set(key, {
          id,
          name: ing.name,
          totalAmount: scaledAmount,
          unit: ing.unit,
          category: ing.category,
          estimatedPrice: scaledPrice,
          checked: false,
          isInPantry: existingPantryIds.has(id) || (ing.isPantryStaple ?? false),
          recipesUsedIn: [meal.recipe.title]
        });
      }
    });
  });

  return Array.from(map.values()).sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.name.localeCompare(b.name);
  });
}

export function calculatePlanStats(plannedMeals: PlannedMeal[], groceryList: GroceryItemConsolidated[]) {
  const activeMeals = plannedMeals.filter(m => !m.isSkipped);
  const totalMealsCount = activeMeals.length;

  if (totalMealsCount === 0) {
    return {
      avgCalories: 0,
      avgProtein: 0,
      avgCarbs: 0,
      avgFat: 0,
      estimatedGroceryTotal: 0,
      sharedIngredientsCount: 0,
      wasteSavingsAmount: 0,
      wasteScorePercent: 100
    };
  }

  let totalCals = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  activeMeals.forEach(m => {
    totalCals += m.recipe.caloriesPerServing;
    totalProtein += m.recipe.proteinGrams;
    totalCarbs += m.recipe.carbsGrams;
    totalFat += m.recipe.fatGrams;
  });

  // Calculate items to buy (excluding items already in pantry)
  const itemsToBuy = groceryList.filter(item => !item.isInPantry);
  const estimatedGroceryTotal = itemsToBuy.reduce((sum, item) => sum + item.estimatedPrice, 0);

  // Perishables shared across >= 2 meals
  const sharedItems = groceryList.filter(item => item.recipesUsedIn.length > 1);
  const sharedIngredientsCount = sharedItems.length;

  // Estimated savings: each shared perishable eliminates buying duplicate separate retail packs (~$2.80 per item saved)
  const wasteSavingsAmount = Math.round(sharedIngredientsCount * 3.20 * 100) / 100;
  
  // Waste score: percentage of grocery items that are either multi-used or fully consumed
  const wasteScorePercent = groceryList.length > 0 
    ? Math.min(98, Math.round(65 + (sharedIngredientsCount / Math.max(1, groceryList.length)) * 60))
    : 100;

  return {
    avgCalories: Math.round(totalCals / totalMealsCount),
    avgProtein: Math.round(totalProtein / totalMealsCount),
    avgCarbs: Math.round(totalCarbs / totalMealsCount),
    avgFat: Math.round(totalFat / totalMealsCount),
    estimatedGroceryTotal: Math.round(estimatedGroceryTotal * 100) / 100,
    sharedIngredientsCount,
    wasteSavingsAmount,
    wasteScorePercent
  };
}
