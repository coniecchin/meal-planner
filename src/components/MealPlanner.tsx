import React from 'react';
import { Sparkles, Plus, Calendar, DollarSign, Users, Store, ArrowRight, ShieldCheck, Leaf, Globe } from 'lucide-react';
import { Recipe, UserPreferences, GroceryPartner } from '../types';
import { RecipeCard } from './RecipeCard';
import { APP_IMAGES } from '../assets/images';

interface MealPlannerProps {
  recipes: Recipe[];
  preferences: UserPreferences;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => void;
  partners: GroceryPartner[];
  onRemoveRecipe: (id: string) => void;
  onReplaceRecipe: (id: string) => void;
  onOpenUpload: () => void;
  onOpenMealDb: () => void;
  onGeneratePlan: () => void;
  isGenerating: boolean;
  onNavigateToCart: () => void;
  totalEstimatedGroceries: number;
  pantrySavings: number;
}

export const MealPlanner: React.FC<MealPlannerProps> = ({
  recipes,
  preferences,
  onUpdatePreferences,
  partners,
  onRemoveRecipe,
  onReplaceRecipe,
  onOpenUpload,
  onOpenMealDb,
  onGeneratePlan,
  isGenerating,
  onNavigateToCart,
  totalEstimatedGroceries,
  pantrySavings
}) => {
  const currentPartner = partners.find(p => p.id === preferences.preferredPartner) || partners[0];
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const budgetUsagePercent = Math.min(100, Math.round((totalEstimatedGroceries / preferences.budget) * 100));
  const isOverBudget = totalEstimatedGroceries > preferences.budget;

  return (
    <div className="space-y-8">
      {/* Hero Value Proposition Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-neutral-900 text-white shadow-md">
        <div className="absolute inset-0 opacity-25">
          <img
            src={APP_IMAGES.hero}
            alt="PrepCart Kitchen"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative p-6 sm:p-8 lg:p-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Designed for Busy Working Adults
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white text-balance leading-tight">
            Eliminate weekly dinner fatigue. <br className="hidden sm:inline" />
            From recipe to grocer cart in 1 click.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-neutral-300 max-w-xl leading-relaxed">
            AI compiles your weekly recipes, checks your home pantry to prevent duplicate buying, and routes consolidated ingredients directly to {currentPartner.name}.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onGeneratePlan}
              disabled={isGenerating}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-neutral-950 font-semibold text-sm rounded-lg transition-all flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-neutral-950" />
              {isGenerating ? 'Synthesizing Recipes...' : `Generate ${preferences.days}-Day AI Plan`}
            </button>

            <button
              onClick={onOpenMealDb}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-lg transition-colors flex items-center gap-2 border border-white/15"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              Browse TheMealDB (Live API)
            </button>

            <button
              onClick={onOpenUpload}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Upload Recipe
            </button>
          </div>
        </div>
      </div>

      {/* Control Strip & Metrics */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Pax Setting */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 block">Number of Pax</label>
              <select
                value={preferences.pax}
                onChange={(e) => onUpdatePreferences({ pax: Number(e.target.value) })}
                className="mt-0.5 text-sm font-semibold text-neutral-900 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
              >
                <option value={1}>1 Person (Solo Meal Prep)</option>
                <option value={2}>2 Pax (Couple / Roommates)</option>
                <option value={3}>3 Pax (Small Family)</option>
                <option value={4}>4 Pax (Family of 4)</option>
                <option value={6}>6+ Pax (Large Household)</option>
              </select>
            </div>
          </div>

          {/* Days Horizon */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 block">Planning Horizon</label>
              <select
                value={preferences.days}
                onChange={(e) => onUpdatePreferences({ days: Number(e.target.value) })}
                className="mt-0.5 text-sm font-semibold text-neutral-900 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
              >
                <option value={1}>1 Day (Ad-hoc Dinner)</option>
                <option value={3}>3 Days (Mid-week Sprint)</option>
                <option value={5}>5 Days (Mon-Fri Workweek)</option>
                <option value={7}>7 Days (Full Weekly Schedule)</option>
              </select>
            </div>
          </div>

          {/* Budget Meter */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-500">Weekly Groceries</span>
                <span className={`font-mono font-semibold ${isOverBudget ? 'text-amber-600' : 'text-emerald-700'}`}>
                  ${totalEstimatedGroceries.toFixed(2)} / ${preferences.budget}
                </span>
              </div>
              <div className="mt-1.5 w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isOverBudget ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${budgetUsagePercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Preferred Partner Selector */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 block">Primary Grocer Partner</label>
              <select
                value={preferences.preferredPartner}
                onChange={(e) => onUpdatePreferences({ preferredPartner: e.target.value as any })}
                className="mt-0.5 text-sm font-semibold text-neutral-900 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
              >
                {partners.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.type === 'instant' ? 'Instant 30m' : 'Scheduled'})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Live Zero-Waste Insight */}
        {pantrySavings > 0 && (
          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>
                <strong className="text-emerald-800 font-semibold font-mono tabular-nums">${pantrySavings.toFixed(2)}</strong> saved by automatically deducting ingredients already in your pantry.
              </span>
            </div>
            <span className="text-neutral-400 hidden sm:inline">Zero food waste engine active</span>
          </div>
        )}
      </div>

      {/* Weekly Recipes Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              Weekly Meal Board ({recipes.length} Meals)
            </h2>
            <p className="text-xs text-neutral-500">
              Each meal is cross-referenced with your pantry to build an optimized shopping list with unified units.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMealDb}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              TheMealDB API
            </button>
            <button
              onClick={onOpenUpload}
              className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Upload Recipe
            </button>
            <button
              onClick={onNavigateToCart}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5"
            >
              Review Smart Cart
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {recipes.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
            <Calendar className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-neutral-900">No Meals in Plan</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-5">
              Click Generate AI Plan to generate recipes tailored to your pax and budget, or paste your own recipes.
            </p>
            <button
              onClick={onGeneratePlan}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              Generate AI Meal Plan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recipes.map((recipe, idx) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                dayLabel={dayNames[idx % dayNames.length]}
                onRemove={onRemoveRecipe}
                onReplace={onReplaceRecipe}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
