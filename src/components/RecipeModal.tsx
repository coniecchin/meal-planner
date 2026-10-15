import React from 'react';
import { Recipe } from '../types';
import { X, Clock, Flame, DollarSign, Users, CheckCircle2, AlertCircle } from 'lucide-react';

interface RecipeModalProps {
  recipe: Recipe | null;
  servings: number;
  onClose: () => void;
  onServingsChange?: (newServings: number) => void;
  onSwapRequest?: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  servings,
  onClose,
  onServingsChange,
  onSwapRequest,
}) => {
  if (!recipe) return null;

  const scale = servings / recipe.servings;
  const scaledCost = (recipe.costPerServing * servings).toFixed(2);
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-neutral-200">
        {/* Header Image with Scrim */}
        <div className="relative h-56 w-full bg-neutral-900 overflow-hidden">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-300 mb-1">
              <span>{recipe.cuisine}</span>
              <span aria-hidden="true">·</span>
              <span>{recipe.dietary.join(', ')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {recipe.title}
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs">
            <div>
              <span className="text-neutral-500 block mb-0.5">Total Time</span>
              <span className="font-semibold text-neutral-900 flex items-center gap-1 font-mono tabular-nums">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                {totalTime} min
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block mb-0.5">Energy</span>
              <span className="font-semibold text-neutral-900 flex items-center gap-1 font-mono tabular-nums">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                {recipe.caloriesPerServing} kcal
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block mb-0.5">Est. Cost</span>
              <span className="font-semibold text-neutral-900 flex items-center gap-1 font-mono tabular-nums">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                ${scaledCost} (${recipe.costPerServing.toFixed(2)}/pax)
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block mb-0.5">Servings</span>
              <div className="flex items-center gap-1 font-mono">
                {onServingsChange ? (
                  <div className="flex items-center border border-neutral-200 rounded bg-white">
                    <button
                      onClick={() => onServingsChange(Math.max(1, servings - 1))}
                      className="px-1.5 py-0.5 hover:bg-neutral-100 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-1.5 font-bold tabular-nums">{servings}</span>
                    <button
                      onClick={() => onServingsChange(servings + 1)}
                      className="px-1.5 py-0.5 hover:bg-neutral-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span className="font-bold tabular-nums">{servings} pax</span>
                )}
              </div>
            </div>
          </div>

          {/* Macros Bar */}
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
              Macronutrient Breakdown (Per Serving)
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-white rounded border border-neutral-100">
                <span className="text-xs text-neutral-500 block">Protein</span>
                <span className="text-sm font-bold font-mono text-neutral-900 tabular-nums">
                  {recipe.proteinGrams}g
                </span>
              </div>
              <div className="p-2 bg-white rounded border border-neutral-100">
                <span className="text-xs text-neutral-500 block">Carbs</span>
                <span className="text-sm font-bold font-mono text-neutral-900 tabular-nums">
                  {recipe.carbsGrams}g
                </span>
              </div>
              <div className="p-2 bg-white rounded border border-neutral-100">
                <span className="text-xs text-neutral-500 block">Healthy Fats</span>
                <span className="text-sm font-bold font-mono text-neutral-900 tabular-nums">
                  {recipe.fatGrams}g
                </span>
              </div>
            </div>
          </div>

          {/* Ingredients list scaled */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-neutral-900">
                Required Ingredients ({servings} {servings === 1 ? 'serving' : 'servings'})
              </h3>
              <span className="text-xs text-emerald-700 font-medium">
                Consolidated automatically in your Grocery Cart
              </span>
            </div>
            <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-lg overflow-hidden bg-white">
              {recipe.ingredients.map(ing => {
                const scaledAmount = Math.round(ing.amount * scale * 10) / 10;
                return (
                  <div key={ing.id} className="flex items-center justify-between p-2.5 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="font-medium text-neutral-900">{ing.name}</span>
                      {ing.isPantryStaple && (
                        <span className="text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                          Pantry Staple
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-neutral-700 font-semibold tabular-nums">
                      {scaledAmount} {ing.unit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Cooking Instructions</h3>
            <ol className="space-y-3">
              {recipe.instructions.map((step, idx) => (
                <li key={idx} className="flex gap-3 text-xs text-neutral-700 leading-relaxed">
                  <span className="font-mono font-bold text-neutral-400 w-5 shrink-0 pt-0.5">
                    0{idx + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
            {onSwapRequest ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSwapRequest();
                }}
                className="px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900 border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer"
              >
                Swap This Meal
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            >
              Close Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
