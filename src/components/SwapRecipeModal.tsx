import React from 'react';
import { Recipe, PlannedMeal } from '../types';
import { INITIAL_RECIPES } from '../data/recipes';
import { X, Clock, DollarSign, Leaf, Sparkles } from 'lucide-react';

interface SwapRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetMeal: PlannedMeal | null;
  allPlannedMeals: PlannedMeal[];
  onSelectRecipe: (mealId: string, recipe: Recipe) => void;
}

export const SwapRecipeModal: React.FC<SwapRecipeModalProps> = ({
  isOpen,
  onClose,
  targetMeal,
  allPlannedMeals,
  onSelectRecipe,
}) => {
  const [filterCuisine, setFilterCuisine] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  if (!isOpen || !targetMeal) return null;

  // Key perishables in current week's other meals to indicate waste synergy
  const otherMealsPerishables = new Set(
    allPlannedMeals
      .filter(m => m.id !== targetMeal.id && !m.isSkipped)
      .map(m => m.recipe.keyPerishable.toLowerCase())
  );

  const filtered = INITIAL_RECIPES.filter(r => {
    if (r.id === targetMeal.recipe.id) return false;
    if (filterCuisine !== 'all' && r.cuisine !== filterCuisine) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchIng = r.ingredients.some(i => i.name.toLowerCase().includes(q));
      if (!matchTitle && !matchIng) return false;
    }
    return true;
  });

  const cuisines = Array.from(new Set(INITIAL_RECIPES.map(r => r.cuisine)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-neutral-200">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              Swap Meal for {targetMeal.dayName}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Current: <span className="font-semibold text-neutral-700">{targetMeal.recipe.title}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterCuisine('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filterCuisine === 'all'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
              }`}
            >
              All Cuisines
            </button>
            {cuisines.map(c => (
              <button
                key={c}
                onClick={() => setFilterCuisine(c)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  filterCuisine === c
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search recipe or ingredient..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 w-full sm:w-56"
          />
        </div>

        {/* Recipe Cards List */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(recipe => {
            const hasSharedPerishable = otherMealsPerishables.has(recipe.keyPerishable.toLowerCase());
            return (
              <div
                key={recipe.id}
                className="group border border-neutral-200 rounded-lg overflow-hidden hover:border-neutral-400 transition-all flex flex-col bg-white"
              >
                <div className="relative h-36 bg-neutral-100 overflow-hidden">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  {hasSharedPerishable && (
                    <div className="absolute top-2 left-2 bg-emerald-700/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                      <Leaf className="w-3 h-3" />
                      <span>Zero-Waste Synergy</span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 mb-1">
                      <span>{recipe.cuisine}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                      {recipe.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                      {recipe.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
                    <div className="text-xs font-mono">
                      <span className="text-neutral-500">Cost: </span>
                      <span className="font-semibold text-neutral-900 tabular-nums">
                        ${recipe.costPerServing.toFixed(2)}/pax
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onSelectRecipe(targetMeal.id, recipe);
                        onClose();
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
                    >
                      Select Recipe
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
