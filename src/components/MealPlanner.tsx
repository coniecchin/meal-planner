import React from 'react';
import { PlannedMeal, Recipe, UserPreferences } from '../types';
import { Clock, Flame, DollarSign, Repeat, Eye, Plus, Leaf, Utensils, Check, Shuffle } from 'lucide-react';

interface MealPlannerProps {
  plannedMeals: PlannedMeal[];
  preferences: UserPreferences;
  onViewRecipe: (recipe: Recipe, servings: number) => void;
  onSwapClick: (meal: PlannedMeal) => void;
  onServingsChange: (mealId: string, newServings: number) => void;
  onToggleSkip: (mealId: string) => void;
  onOpenAddRecipe: () => void;
  onAutoGenerate: () => void;
}

export const MealPlanner: React.FC<MealPlannerProps> = ({
  plannedMeals,
  preferences,
  onViewRecipe,
  onSwapClick,
  onServingsChange,
  onToggleSkip,
  onOpenAddRecipe,
  onAutoGenerate,
}) => {
  // Compute perishable overlap across meals to highlight zero-waste synergies
  const perishableCounts: Record<string, number> = {};
  plannedMeals.forEach(m => {
    if (!m.isSkipped) {
      const p = m.recipe.keyPerishable.toLowerCase();
      perishableCounts[p] = (perishableCounts[p] || 0) + 1;
    }
  });

  return (
    <div className="space-y-6">
      {/* Planner Actions Sub-bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-200">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
            Weekly Meal Schedule ({preferences.plannedDays} Days)
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Balanced recipes designed to share fresh perishables and minimize food waste.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddRecipe}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Recipe</span>
          </button>

          <button
            onClick={onAutoGenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle Week</span>
          </button>
        </div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {plannedMeals.map((meal, index) => {
          const isShared = (perishableCounts[meal.recipe.keyPerishable.toLowerCase()] || 0) > 1;
          const cost = (meal.recipe.costPerServing * meal.servings).toFixed(2);
          const totalTime = meal.recipe.prepTimeMinutes + meal.recipe.cookTimeMinutes;

          return (
            <div
              key={meal.id}
              className={`rounded-xl border transition-all flex flex-col bg-white overflow-hidden ${
                meal.isSkipped
                  ? 'border-neutral-200 bg-neutral-50/70 opacity-70'
                  : 'border-neutral-200 hover:border-neutral-300 shadow-xs'
              }`}
            >
              {/* Day Header */}
              <div className="px-4 py-2.5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-900">
                    Day {index + 1}
                  </span>
                  <span className="text-xs text-neutral-500 ml-1.5 font-medium">
                    · {meal.dayName}
                  </span>
                </div>

                <button
                  onClick={() => onToggleSkip(meal.id)}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    meal.isSkipped
                      ? 'bg-amber-100 text-amber-800'
                      : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200'
                  }`}
                  title={meal.isSkipped ? 'Click to re-activate dinner' : 'Mark as eating out or leftovers'}
                >
                  {meal.isSkipped ? 'Leftovers / Dine Out' : 'Skip / Out'}
                </button>
              </div>

              {meal.isSkipped ? (
                <div className="p-6 flex-1 flex flex-col items-center justify-center text-center text-neutral-400">
                  <Utensils className="w-8 h-8 mb-2 stroke-1 text-neutral-300" />
                  <p className="text-xs font-semibold text-neutral-600">Off Night / Leftovers</p>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    No groceries budgeted for this meal slot.
                  </p>
                  <button
                    onClick={() => onToggleSkip(meal.id)}
                    className="mt-4 text-xs font-medium text-emerald-700 hover:text-emerald-800 cursor-pointer"
                  >
                    + Restore Cooked Meal
                  </button>
                </div>
              ) : (
                <>
                  {/* Recipe Image with Perishable Synergies Tag */}
                  <div className="relative h-40 bg-neutral-100 overflow-hidden group">
                    <img
                      src={meal.recipe.imageUrl}
                      alt={meal.recipe.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />

                    {isShared && (
                      <div className="absolute top-2 left-2 bg-emerald-800/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs flex items-center gap-1 backdrop-blur-xs">
                        <Leaf className="w-3 h-3" />
                        <span>Shared {meal.recipe.keyPerishable}</span>
                      </div>
                    )}

                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs tabular-nums">
                      {meal.recipe.cuisine}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3
                        onClick={() => onViewRecipe(meal.recipe, meal.servings)}
                        className="text-sm font-bold text-neutral-900 leading-snug hover:text-emerald-700 cursor-pointer transition-colors"
                      >
                        {meal.recipe.title}
                      </h3>

                      {/* Micro info */}
                      <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-2 font-mono tabular-nums">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          {totalTime}m
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-500" />
                          {meal.recipe.caloriesPerServing} kcal
                        </span>
                        <span>·</span>
                        <span className="text-neutral-700 font-semibold">
                          {meal.recipe.proteinGrams}g P
                        </span>
                      </div>
                    </div>

                    {/* Cost and Servings controls */}
                    <div className="pt-2 border-t border-neutral-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 font-mono text-neutral-700">
                          <DollarSign className="w-3 h-3 text-emerald-600" />
                          <span className="font-bold tabular-nums">${cost}</span>
                          <span className="text-[10px] text-neutral-400">total</span>
                        </div>

                        {/* Servings scaled for this night */}
                        <div className="flex items-center border border-neutral-200 rounded bg-neutral-50 text-[11px] font-mono">
                          <button
                            onClick={() => onServingsChange(meal.id, Math.max(1, meal.servings - 1))}
                            className="px-1.5 py-0.5 hover:bg-neutral-200 text-neutral-600 cursor-pointer"
                            title="Decrease Pax for this night"
                          >
                            -
                          </button>
                          <span className="px-1.5 font-bold tabular-nums">
                            {meal.servings}p
                          </span>
                          <button
                            onClick={() => onServingsChange(meal.id, meal.servings + 1)}
                            className="px-1.5 py-0.5 hover:bg-neutral-200 text-neutral-600 cursor-pointer"
                            title="Increase Pax for this night"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <button
                          onClick={() => onViewRecipe(meal.recipe, meal.servings)}
                          className="flex items-center justify-center gap-1 py-1.5 text-[11px] font-medium text-neutral-700 hover:text-neutral-900 border border-neutral-200 hover:bg-neutral-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-neutral-400" />
                          <span>Recipe</span>
                        </button>

                        <button
                          onClick={() => onSwapClick(meal)}
                          className="flex items-center justify-center gap-1 py-1.5 text-[11px] font-medium text-neutral-700 hover:text-neutral-900 border border-neutral-200 hover:bg-neutral-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Repeat className="w-3 h-3 text-neutral-400" />
                          <span>Swap</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
