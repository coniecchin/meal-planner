import React from 'react';
import { CuisineType, DietaryRestriction, Recipe } from '../types';
import { Clock, Flame, DollarSign, Plus, Eye, Sparkles, Search, Leaf } from 'lucide-react';

interface RecipeBoxProps {
  recipes: Recipe[];
  onViewRecipe: (recipe: Recipe) => void;
  onOpenAddRecipe: () => void;
  onAssignToPlan: (recipe: Recipe) => void;
}

export const RecipeBox: React.FC<RecipeBoxProps> = ({
  recipes,
  onViewRecipe,
  onOpenAddRecipe,
  onAssignToPlan,
}) => {
  const [selectedCuisine, setSelectedCuisine] = React.useState<string>('all');
  const [selectedDiet, setSelectedDiet] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const cuisines = Array.from(new Set(recipes.map(r => r.cuisine)));
  const diets: DietaryRestriction[] = [
    'High-Protein',
    'Low-Carb',
    'Gluten-Free',
    'Vegetarian',
    'Pescatarian',
    'Quick Prep (<30 min)',
  ];

  const filtered = recipes.filter(r => {
    if (selectedCuisine !== 'all' && r.cuisine !== selectedCuisine) return false;
    if (selectedDiet !== 'all' && !r.dietary.includes(selectedDiet as any)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchIng = r.ingredients.some(i => i.name.toLowerCase().includes(q));
      if (!matchTitle && !matchIng) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
              Recipe Library & Smart Discovery
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Curated quick, fuss-free dinners designed to share ingredients and reduce food waste.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddRecipe}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload / Paste Recipe</span>
            </button>
          </div>
        </div>

        {/* Filter Strip */}
        <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Cuisine Segment */}
            <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg overflow-x-auto max-w-full">
              <button
                onClick={() => setSelectedCuisine('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCuisine === 'all'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All Cuisines
              </button>
              {cuisines.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCuisine(c)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    selectedCuisine === c
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Diet Dropdown */}
            <select
              value={selectedDiet}
              onChange={e => setSelectedDiet(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              <option value="all">All Dietary Goals</option>
              {diets.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search recipes or ingredients..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 w-full sm:w-60"
            />
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(recipe => {
          const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

          return (
            <div
              key={recipe.id}
              className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-300 transition-all shadow-xs flex flex-col group"
            >
              <div className="relative h-44 bg-neutral-100 overflow-hidden">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />

                <div className="absolute top-2 left-2 bg-emerald-800/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs flex items-center gap-1 backdrop-blur-xs">
                  <Leaf className="w-3 h-3" />
                  <span>Key: {recipe.keyPerishable}</span>
                </div>

                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                  {recipe.cuisine}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3
                    onClick={() => onViewRecipe(recipe)}
                    className="text-sm font-bold text-neutral-900 leading-snug hover:text-emerald-700 cursor-pointer transition-colors"
                  >
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-600 tabular-nums">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      {totalTime}m
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-500" />
                      {recipe.caloriesPerServing} kcal
                    </span>
                    <span>·</span>
                    <span className="font-semibold text-neutral-900">
                      ${recipe.costPerServing.toFixed(2)}/pax
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onViewRecipe(recipe)}
                      className="flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Details</span>
                    </button>

                    <button
                      onClick={() => onAssignToPlan(recipe)}
                      className="flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Plan</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
