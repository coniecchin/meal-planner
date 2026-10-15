import React, { useState, useEffect } from 'react';
import { X, Globe, Sparkles, Plus, Loader2, Search, Check, ExternalLink, ChefHat, ArrowRight } from 'lucide-react';
import { Recipe } from '../types';

interface MealDbExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportRecipe: (recipe: Recipe) => void;
}

interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCountry?: string;
  strArea?: string;
}

export const MealDbExplorerModal: React.FC<MealDbExplorerModalProps> = ({
  isOpen,
  onClose,
  onImportRecipe
}) => {
  const [selectedIngredient, setSelectedIngredient] = useState('chicken_breast');
  const [customQuery, setCustomQuery] = useState('');
  const [meals, setMeals] = useState<MealSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [importingId, setImportingId] = useState<string | null>(null);
  const [importedIds, setImportedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const quickIngredients = [
    { label: 'Chicken Breast (API Default)', value: 'chicken_breast' },
    { label: 'Salmon', value: 'salmon' },
    { label: 'Beef', value: 'beef' },
    { label: 'Pork', value: 'pork' },
    { label: 'Tofu', value: 'tofu' },
    { label: 'Broccoli', value: 'broccoli' }
  ];

  // Fetch meals from serverless endpoint
  const fetchMeals = async (ing: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/meals/filter?i=${encodeURIComponent(ing)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.meals)) {
        setMeals(data.meals);
      } else {
        setMeals([]);
        if (data.error) setError(data.error);
      }
    } catch (err: any) {
      console.error('Failed to fetch from TheMealDB:', err);
      setError('Unable to connect to TheMealDB service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMeals(selectedIngredient);
    }
  }, [isOpen, selectedIngredient]);

  const handleSelectIngredient = (ing: string) => {
    setSelectedIngredient(ing);
    setCustomQuery('');
    fetchMeals(ing);
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    const formatted = customQuery.trim().toLowerCase().replace(/\s+/g, '_');
    setSelectedIngredient(formatted);
    fetchMeals(formatted);
  };

  const handleImport = async (meal: MealSummary) => {
    setImportingId(meal.idMeal);
    try {
      const res = await fetch(`/api/meals/detail/${meal.idMeal}`);
      const data = await res.json();
      if (data.success && data.recipe) {
        onImportRecipe(data.recipe);
        setImportedIds(prev => new Set(prev).add(meal.idMeal));
      } else {
        throw new Error(data.error || 'Failed to import recipe');
      }
    } catch (err: any) {
      console.error('Error importing recipe:', err);
      alert('Failed to import recipe details: ' + (err.message || 'Unknown error'));
    } finally {
      setImportingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-neutral-900">
                  TheMealDB Live Serverless Connection
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  LIVE KEYLESS API
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">
                https://www.themealdb.com/api/json/v1/1/filter.php?i={selectedIngredient}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Query Controls Strip */}
        <div className="p-4 bg-neutral-50 border-b border-neutral-200 space-y-3">
          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-neutral-500 font-medium whitespace-nowrap shrink-0 mr-1">
              Filter by Ingredient:
            </span>
            {quickIngredients.map(item => (
              <button
                key={item.value}
                onClick={() => handleSelectIngredient(item.value)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-medium cursor-pointer ${
                  selectedIngredient === item.value
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Custom Search Form */}
          <form onSubmit={handleCustomSearch} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Or query any ingredient in TheMealDB (e.g. prawns, duck, mushroom, tomato)..."
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              Query API
            </button>
          </form>
        </div>

        {/* Results Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
              <p className="text-xs text-neutral-500 font-medium">
                Pinging TheMealDB API for "{selectedIngredient}" meals...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs">
              {error}
            </div>
          ) : meals.length === 0 ? (
            <div className="py-16 text-center text-neutral-400 text-xs">
              No recipes found for ingredient "{selectedIngredient}". Try another ingredient like "chicken_breast" or "salmon".
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-neutral-500">
                  Found <strong>{meals.length}</strong> recipes for <code className="font-mono text-neutral-800 bg-neutral-100 px-1 py-0.5 rounded">{selectedIngredient}</code>
                </span>
                <span className="text-[11px] text-neutral-400">
                  Click Import to parse full ingredients & add to weekly grocery cart
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {meals.map((meal) => {
                  const isImported = importedIds.has(meal.idMeal);
                  const isCurrentlyImporting = importingId === meal.idMeal;

                  return (
                    <div
                      key={meal.idMeal}
                      className="bg-white rounded-xl border border-neutral-200 overflow-hidden flex flex-col hover:border-neutral-300 transition-all shadow-xs"
                    >
                      <div className="relative aspect-16/10 bg-neutral-100 overflow-hidden">
                        <img
                          src={meal.strMealThumb}
                          alt={meal.strMeal}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-2 right-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-black/60 text-white rounded-md backdrop-blur-xs">
                            #{meal.idMeal}
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-neutral-900 text-xs line-clamp-1">
                            {meal.strMeal}
                          </h4>
                          <span className="text-[11px] text-neutral-400 block mt-0.5">
                            TheMealDB Catalog {meal.strCountry ? `· ${meal.strCountry}` : ''}
                          </span>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between">
                          <a
                            href={`https://www.themealdb.com/meal/${meal.idMeal}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-neutral-500 hover:text-neutral-800 flex items-center gap-1"
                          >
                            <span>View Source</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <button
                            onClick={() => handleImport(meal)}
                            disabled={isCurrentlyImporting || isImported}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                              isImported
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                                : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-xs'
                            }`}
                          >
                            {isCurrentlyImporting ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Importing...</span>
                              </>
                            ) : isImported ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Imported!</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Import to Plan</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span>Serverless Proxy: /api/meals/filter & /api/meals/detail</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-lg font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
