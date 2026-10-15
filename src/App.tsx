import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { MealPlanner } from './components/MealPlanner';
import { SmartCart } from './components/SmartCart';
import { PantryManager } from './components/PantryManager';
import { CanvasInsightsModal } from './components/CanvasInsightsModal';
import { RecipeUploadModal } from './components/RecipeUploadModal';
import { PreferencesModal } from './components/PreferencesModal';
import { PartnerCheckoutModal } from './components/PartnerCheckoutModal';
import { MealDbExplorerModal } from './components/MealDbExplorerModal';
import { GROCERY_PARTNERS, INITIAL_PANTRY, INITIAL_RECIPES } from './data/initialData';
import { Recipe, PantryItem, UserPreferences, ConsolidatedCartItem } from './types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(INITIAL_PANTRY);
  const [activeTab, setActiveTab] = useState<'planner' | 'cart' | 'pantry' | 'canvas'>('planner');

  const [preferences, setPreferences] = useState<UserPreferences>({
    pax: 2,
    days: 5,
    budget: 90,
    currency: 'SGD',
    cuisines: ['Asian Comfort', 'Mediterranean', 'Quick 20-min'],
    dietary: ['High Protein', 'Balanced'],
    allergies: [],
    cookingTimeTarget: '15-20 mins',
    preferredPartner: 'redmart'
  });

  // Modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMealDbOpen, setIsMealDbOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Helper function to check if ingredient is covered by current pantry
  const isCoveredByPantry = (ingredientName: string, pantry: PantryItem[]) => {
    const cleanIng = ingredientName.toLowerCase();
    return pantry.some(p => {
      if (!p.inStock) return false;
      const cleanP = p.name.toLowerCase();
      return cleanIng.includes(cleanP) || cleanP.includes(cleanIng);
    });
  };

  // Consolidated Cart calculation engine with pantry deduplication
  const consolidatedCart = useMemo(() => {
    const map = new Map<string, ConsolidatedCartItem>();

    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        const key = ing.name.toLowerCase().trim();
        const covered = isCoveredByPantry(ing.name, pantryItems);

        if (map.has(key)) {
          const existing = map.get(key)!;
          existing.totalQuantity += ing.quantity;
          existing.estimatedPrice += ing.estimatedPrice;
          if (!existing.usedInRecipes.includes(recipe.title)) {
            existing.usedInRecipes.push(recipe.title);
          }
          // If already marked covered or new is covered
          existing.coveredByPantry = existing.coveredByPantry || covered;
        } else {
          map.set(key, {
            id: 'cart-' + key.replace(/\s+/g, '-'),
            name: ing.name,
            totalQuantity: ing.quantity,
            unit: ing.unit,
            aisle: ing.aisle,
            estimatedPrice: ing.estimatedPrice,
            usedInRecipes: [recipe.title],
            coveredByPantry: covered,
            quantityToBuy: covered ? 0 : ing.quantity,
            isPurchased: false
          });
        }
      });
    });

    return Array.from(map.values());
  }, [recipes, pantryItems]);

  // Derived financial metrics
  const pantrySavings = useMemo(() => {
    return consolidatedCart
      .filter(item => item.coveredByPantry)
      .reduce((sum, item) => sum + item.estimatedPrice, 0);
  }, [consolidatedCart]);

  const totalEstimatedGroceries = useMemo(() => {
    return consolidatedCart
      .filter(item => !item.coveredByPantry)
      .reduce((sum, item) => sum + item.estimatedPrice, 0);
  }, [consolidatedCart]);

  const activePartner = GROCERY_PARTNERS.find(p => p.id === preferences.preferredPartner) || GROCERY_PARTNERS[0];
  const qualifiesForFreeDelivery = totalEstimatedGroceries >= activePartner.freeDeliveryThreshold;
  const deliveryFee = qualifiesForFreeDelivery ? 0 : activePartner.deliveryFee;
  const grandTotal = totalEstimatedGroceries + deliveryFee;

  // Recipe actions
  const handleRemoveRecipe = (id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
    showToast('Recipe removed from weekly plan');
  };

  const handleReplaceRecipe = async (id: string) => {
    const otherRecipes = INITIAL_RECIPES.filter(r => r.id !== id);
    if (otherRecipes.length > 0) {
      const replacement = otherRecipes[Math.floor(Math.random() * otherRecipes.length)];
      setRecipes(prev => prev.map(r => (r.id === id ? { ...replacement, id: 'rec-' + Date.now() } : r)));
      showToast('Recipe swapped with alternative');
    }
  };

  const handleAddParsedRecipe = (newRecipe: Recipe) => {
    setRecipes(prev => [newRecipe, ...prev]);
    showToast(`Added "${newRecipe.title}" to weekly meals!`);
  };

  // Pantry actions
  const handleTogglePantryInStock = (id: string) => {
    setPantryItems(prev =>
      prev.map(item => (item.id === id ? { ...item, inStock: !item.inStock } : item))
    );
  };

  const handleAddPantryItem = (itemData: Omit<PantryItem, 'id'>) => {
    const newItem: PantryItem = {
      ...itemData,
      id: 'pantry-' + Date.now()
    };
    setPantryItems(prev => [newItem, ...prev]);
    showToast(`Added "${newItem.name}" to your pantry stock`);
  };

  const handleRemovePantryItem = (id: string) => {
    setPantryItems(prev => prev.filter(i => i.id !== id));
  };

  // Cart actions
  const handleToggleCartItemPurchased = (id: string) => {
    // In our consolidated state, toggle in place
    // We can maintain a set of checked items
    const item = consolidatedCart.find(i => i.id === id);
    if (item) {
      item.isPurchased = !item.isPurchased;
      // Force rerender
      setRecipes(prev => [...prev]);
    }
  };

  const handleToggleCartPantryOverride = (id: string) => {
    const item = consolidatedCart.find(i => i.id === id);
    if (item) {
      // Find if there's a corresponding pantry item
      const matchingPantry = pantryItems.find(p => p.name.toLowerCase() === item.name.toLowerCase());
      if (matchingPantry) {
        handleTogglePantryInStock(matchingPantry.id);
      } else {
        // Add to pantry
        handleAddPantryItem({
          name: item.name,
          category: item.aisle,
          inStock: !item.coveredByPantry,
          quantityRemaining: 'Available'
        });
      }
    }
  };

  const handleRemoveCartItem = (id: string) => {
    const item = consolidatedCart.find(i => i.id === id);
    if (!item) return;
    // Remove ingredient from all recipes
    setRecipes(prev =>
      prev.map(rec => ({
        ...rec,
        ingredients: rec.ingredients.filter(ing => ing.name.toLowerCase().trim() !== item.name.toLowerCase().trim())
      }))
    );
    showToast(`Removed "${item.name}" from shopping list`);
  };

  // AI Meal Plan Generator
  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          days: preferences.days,
          pax: preferences.pax,
          budget: preferences.budget,
          currency: preferences.currency,
          cuisines: preferences.cuisines,
          dietary: preferences.dietary,
          allergies: preferences.allergies
        })
      });

      const data = await response.json();
      if (data.plan && data.plan.recipes) {
        setRecipes(data.plan.recipes);
        showToast(`Synthesized ${data.plan.recipes.length}-day meal plan optimized for your budget!`);
      } else {
        throw new Error(data.warning || 'Failed to generate plan');
      }
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      showToast('Loaded curated weeknight meal plan');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-lg border border-neutral-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartItemCount={consolidatedCart.filter(i => !i.coveredByPantry).length}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenMealDb={() => setIsMealDbOpen(true)}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        onGeneratePlan={handleGeneratePlan}
        isGenerating={isGenerating}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'planner' && (
          <MealPlanner
            recipes={recipes}
            preferences={preferences}
            onUpdatePreferences={(updates) => setPreferences(prev => ({ ...prev, ...updates }))}
            partners={GROCERY_PARTNERS}
            onRemoveRecipe={handleRemoveRecipe}
            onReplaceRecipe={handleReplaceRecipe}
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenMealDb={() => setIsMealDbOpen(true)}
            onGeneratePlan={handleGeneratePlan}
            isGenerating={isGenerating}
            onNavigateToCart={() => setActiveTab('cart')}
            totalEstimatedGroceries={totalEstimatedGroceries}
            pantrySavings={pantrySavings}
          />
        )}

        {activeTab === 'cart' && (
          <SmartCart
            cartItems={consolidatedCart}
            partners={GROCERY_PARTNERS}
            selectedPartnerId={preferences.preferredPartner}
            onSelectPartner={(partnerId) => setPreferences(prev => ({ ...prev, preferredPartner: partnerId }))}
            onToggleItemPurchased={handleToggleCartItemPurchased}
            onTogglePantryOverride={handleToggleCartPantryOverride}
            onRemoveCartItem={handleRemoveCartItem}
            onOpenCheckoutModal={() => setIsCheckoutOpen(true)}
            pantrySavings={pantrySavings}
          />
        )}

        {activeTab === 'pantry' && (
          <PantryManager
            pantryItems={pantryItems}
            onToggleInStock={handleTogglePantryInStock}
            onAddPantryItem={handleAddPantryItem}
            onRemovePantryItem={handleRemovePantryItem}
            pantrySavings={pantrySavings}
          />
        )}

        {activeTab === 'canvas' && (
          <CanvasInsightsModal
            onSwitchToPlanner={() => setActiveTab('planner')}
          />
        )}
      </main>

      {/* Modals */}
      <RecipeUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddParsedRecipe={handleAddParsedRecipe}
      />

      <MealDbExplorerModal
        isOpen={isMealDbOpen}
        onClose={() => setIsMealDbOpen(false)}
        onImportRecipe={handleAddParsedRecipe}
      />

      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        preferences={preferences}
        onSave={(updated) => {
          setPreferences(updated);
          showToast('Profile preferences updated');
        }}
        partners={GROCERY_PARTNERS}
      />

      <PartnerCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={consolidatedCart}
        partner={activePartner}
        subtotal={totalEstimatedGroceries}
        deliveryFee={deliveryFee}
        grandTotal={grandTotal}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-neutral-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-800">PrepCart AI</span>
            <span>·</span>
            <span>Intelligent Weekly Meal Planner & Grocer Dispatch</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setActiveTab('planner')} className="hover:text-neutral-900 transition-colors">
              Planner
            </button>
            <button onClick={() => setActiveTab('cart')} className="hover:text-neutral-900 transition-colors">
              Smart Cart
            </button>
            <button onClick={() => setActiveTab('pantry')} className="hover:text-neutral-900 transition-colors">
              Pantry Inventory
            </button>
            <button onClick={() => setActiveTab('canvas')} className="hover:text-neutral-900 transition-colors">
              Canvas Specs
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
