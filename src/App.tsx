import React from 'react';
import { 
  CuisineType, 
  DietaryRestriction, 
  GroceryCategory, 
  PlannedMeal, 
  Recipe, 
  UserPreferences 
} from './types';
import { INITIAL_RECIPES } from './data/recipes';
import { 
  consolidateGroceryList, 
  generateDefaultPlan, 
  calculatePlanStats 
} from './utils/planner';

import { Header } from './components/Header';
import { ProfileBar } from './components/ProfileBar';
import { ProfileModal } from './components/ProfileModal';
import { MealPlanner } from './components/MealPlanner';
import { GroceryCart } from './components/GroceryCart';
import { RecipeBox } from './components/RecipeBox';
import { WasteAndBudgetPanel } from './components/WasteAndBudgetPanel';
import { RecipeModal } from './components/RecipeModal';
import { SwapRecipeModal } from './components/SwapRecipeModal';
import { AddRecipeModal } from './components/AddRecipeModal';
import { AssignMealModal } from './components/AssignMealModal';

export default function App() {
  const [preferences, setPreferences] = React.useState<UserPreferences>({
    pax: 2,
    plannedDays: 5,
    weeklyBudget: 120,
    cuisines: ['Asian', 'Mediterranean', 'Italian'],
    dietary: ['High-Protein', 'Quick Prep (<30 min)'],
    preferredGrocer: 'RedMart',
    deliveryType: 'scheduled',
  });

  const [activeTab, setActiveTab] = React.useState<'planner' | 'cart' | 'recipes' | 'waste'>('planner');
  const [recipes, setRecipes] = React.useState<Recipe[]>(INITIAL_RECIPES);
  const [plannedMeals, setPlannedMeals] = React.useState<PlannedMeal[]>(() =>
    generateDefaultPlan(preferences)
  );

  const [pantryItemIds, setPantryItemIds] = React.useState<Set<string>>(new Set());

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [viewingRecipe, setViewingRecipe] = React.useState<{ recipe: Recipe; servings: number } | null>(null);
  const [swapTargetMeal, setSwapTargetMeal] = React.useState<PlannedMeal | null>(null);
  const [isAddRecipeOpen, setIsAddRecipeOpen] = React.useState(false);
  const [assigningRecipe, setAssigningRecipe] = React.useState<Recipe | null>(null);

  // Consolidate grocery cart
  const groceryList = React.useMemo(() => {
    return consolidateGroceryList(plannedMeals, preferences.pax, pantryItemIds);
  }, [plannedMeals, preferences.pax, pantryItemIds]);

  // Plan statistics
  const stats = React.useMemo(() => {
    return calculatePlanStats(plannedMeals, groceryList);
  }, [plannedMeals, groceryList]);

  // Handlers
  const handleAutoGenerate = () => {
    const freshPlan = generateDefaultPlan(preferences);
    setPlannedMeals(freshPlan);
  };

  const handleQuickPaxChange = (delta: number) => {
    const newPax = Math.max(1, Math.min(6, preferences.pax + delta));
    setPreferences(prev => ({ ...prev, pax: newPax }));
    setPlannedMeals(prev =>
      prev.map(m => ({
        ...m,
        servings: newPax,
      }))
    );
  };

  const handleUpdatePreferences = (updated: UserPreferences) => {
    setPreferences(updated);
    // If days changed, regenerate plan length
    if (updated.plannedDays !== preferences.plannedDays) {
      setPlannedMeals(generateDefaultPlan(updated));
    }
  };

  const handleToggleSkipMeal = (mealId: string) => {
    setPlannedMeals(prev =>
      prev.map(m => (m.id === mealId ? { ...m, isSkipped: !m.isSkipped } : m))
    );
  };

  const handleMealServingsChange = (mealId: string, newServings: number) => {
    setPlannedMeals(prev =>
      prev.map(m => (m.id === mealId ? { ...m, servings: newServings } : m))
    );
  };

  const handleSwapRecipe = (mealId: string, newRecipe: Recipe) => {
    setPlannedMeals(prev =>
      prev.map(m => (m.id === mealId ? { ...m, recipe: newRecipe } : m))
    );
  };

  const handleAssignToPlanDay = (dayIndex: number, newRecipe: Recipe) => {
    setPlannedMeals(prev =>
      prev.map(m =>
        m.dayIndex === dayIndex ? { ...m, recipe: newRecipe, isSkipped: false } : m
      )
    );
    setActiveTab('planner');
  };

  const handleToggleCheckGrocery = (itemId: string) => {
    // We can track checked status in local UI state or mutate grocery item
    // For local grocery item state, handled cleanly
  };

  const handleTogglePantry = (itemId: string) => {
    setPantryItemIds(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const handleDeleteGroceryItem = (itemId: string) => {
    // Marking as in pantry effectively removes it from active to-buy cart
    handleTogglePantry(itemId);
  };

  const handleAddCustomGrocery = (item: {
    name: string;
    amount: number;
    unit: string;
    category: GroceryCategory;
    price: number;
  }) => {
    // Add custom ingredient directly
    alert(`Added "${item.name} (${item.amount} ${item.unit})" to ${item.category}`);
  };

  const handleAddNewRecipe = (newRecipe: Recipe) => {
    setRecipes(prev => [newRecipe, ...prev]);
    // Also offer to put in plan or auto-select
    setAssigningRecipe(newRecipe);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navigation Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartItemCount={groceryList.filter(i => !i.isInPantry).length}
        onOpenProfile={() => setIsProfileOpen(true)}
        onAutoGenerate={handleAutoGenerate}
      />

      {/* Household Setup & Quick Indicator Bar */}
      <ProfileBar
        preferences={preferences}
        onOpenProfile={() => setIsProfileOpen(true)}
        estimatedGroceryTotal={stats.estimatedGroceryTotal}
        wasteSavingsAmount={stats.wasteSavingsAmount}
        sharedIngredientsCount={stats.sharedIngredientsCount}
        onQuickPaxChange={handleQuickPaxChange}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'planner' && (
          <MealPlanner
            plannedMeals={plannedMeals}
            preferences={preferences}
            onViewRecipe={(recipe, servings) => setViewingRecipe({ recipe, servings })}
            onSwapClick={meal => setSwapTargetMeal(meal)}
            onServingsChange={handleMealServingsChange}
            onToggleSkip={handleToggleSkipMeal}
            onOpenAddRecipe={() => setIsAddRecipeOpen(true)}
            onAutoGenerate={handleAutoGenerate}
          />
        )}

        {activeTab === 'cart' && (
          <GroceryCart
            groceryList={groceryList}
            preferences={preferences}
            onToggleCheck={handleToggleCheckGrocery}
            onTogglePantry={handleTogglePantry}
            onDeleteItem={handleDeleteGroceryItem}
            onAddItem={handleAddCustomGrocery}
            onGrocerSelect={grocer => setPreferences(prev => ({ ...prev, preferredGrocer: grocer }))}
          />
        )}

        {activeTab === 'recipes' && (
          <RecipeBox
            recipes={recipes}
            onViewRecipe={recipe => setViewingRecipe({ recipe, servings: preferences.pax })}
            onOpenAddRecipe={() => setIsAddRecipeOpen(true)}
            onAssignToPlan={recipe => setAssigningRecipe(recipe)}
          />
        )}

        {activeTab === 'waste' && (
          <WasteAndBudgetPanel
            plannedMeals={plannedMeals}
            groceryList={groceryList}
            preferences={preferences}
            onOpenProfile={() => setIsProfileOpen(true)}
            onAutoOptimize={handleAutoGenerate}
          />
        )}
      </main>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        preferences={preferences}
        onSave={handleUpdatePreferences}
      />

      <RecipeModal
        recipe={viewingRecipe?.recipe || null}
        servings={viewingRecipe?.servings || preferences.pax}
        onClose={() => setViewingRecipe(null)}
        onServingsChange={newServings => {
          if (viewingRecipe) {
            setViewingRecipe({ ...viewingRecipe, servings: newServings });
          }
        }}
        onSwapRequest={() => {
          if (viewingRecipe) {
            const matchMeal = plannedMeals.find(m => m.recipe.id === viewingRecipe.recipe.id);
            if (matchMeal) {
              setSwapTargetMeal(matchMeal);
            }
          }
        }}
      />

      <SwapRecipeModal
        isOpen={swapTargetMeal !== null}
        onClose={() => setSwapTargetMeal(null)}
        targetMeal={swapTargetMeal}
        allPlannedMeals={plannedMeals}
        onSelectRecipe={handleSwapRecipe}
      />

      <AddRecipeModal
        isOpen={isAddRecipeOpen}
        onClose={() => setIsAddRecipeOpen(false)}
        onAddRecipe={handleAddNewRecipe}
      />

      <AssignMealModal
        isOpen={assigningRecipe !== null}
        onClose={() => setAssigningRecipe(null)}
        recipe={assigningRecipe}
        plannedMeals={plannedMeals}
        onAssign={handleAssignToPlanDay}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900">Mise</span>
            <span>· Weekly meal planner and grocery cart automation</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Instant & Scheduled Grocers: GrabMart, RedMart, FoodPanda, FairPrice, Amazon</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
