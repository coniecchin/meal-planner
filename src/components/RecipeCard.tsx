import React, { useState } from 'react';
import { Clock, Users, Flame, ChevronDown, ChevronUp, Trash2, CheckCircle2, RefreshCw, ChefHat } from 'lucide-react';
import { Recipe } from '../types';
import { resolveImageUrl } from '../assets/images';

interface RecipeCardProps {
  recipe: Recipe;
  dayLabel: string;
  onRemove: (id: string) => void;
  onReplace: (id: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  dayLabel,
  onRemove,
  onReplace
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');
  const [imageError, setImageError] = useState(false);

  const totalTime = recipe.prepTimeMins + recipe.cookTimeMins;
  const imageUrl = resolveImageUrl(recipe.image);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden flex flex-col hover:border-neutral-300 transition-all shadow-xs">
      {/* Card Header Media */}
      <div className="relative aspect-16/9 w-full bg-neutral-100 overflow-hidden group">
        {!imageError ? (
          <img
            src={imageUrl}
            alt={recipe.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex flex-col items-center justify-center p-4 text-center">
            <ChefHat className="w-8 h-8 text-emerald-400 mb-1 opacity-70" />
            <span className="text-xs text-white/90 font-medium line-clamp-1">{recipe.title}</span>
          </div>
        )}
        {/* Overlay gradient scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-between p-3.5 text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2.5 py-1 bg-white/90 text-neutral-900 rounded-md backdrop-blur-xs">
              {dayLabel}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onReplace(recipe.id)}
                title="Swap recipe"
                className="p-1.5 bg-black/40 hover:bg-black/60 rounded-md text-white/90 hover:text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onRemove(recipe.id)}
                title="Remove from plan"
                className="p-1.5 bg-black/40 hover:bg-red-600/80 rounded-md text-white/90 hover:text-white transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-white/90 font-medium">
              <span>{recipe.cuisine}</span>
              {recipe.dietaryTags.length > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{recipe.dietaryTags[0]}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-neutral-900 text-base line-clamp-1 leading-snug">
            {recipe.title}
          </h3>
          <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
            {recipe.description}
          </p>

          {/* Unboxed Metadata (Zero-Pill rule) */}
          <div className="flex items-center gap-2 text-xs text-neutral-600 mt-3 pt-2.5 border-t border-neutral-100">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              {totalTime}m
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-neutral-400" />
              {recipe.servings} pax
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-neutral-400" />
              <span className="tabular-nums font-mono">{recipe.nutritionPerServing.calories}</span> kcal
            </span>
          </div>

          {/* Nutritional Macros Strip */}
          <div className="grid grid-cols-3 gap-2 mt-2.5 py-1.5 px-2 bg-neutral-50 rounded-lg text-center text-xs">
            <div>
              <span className="text-neutral-400 block text-[10px]">Protein</span>
              <span className="font-semibold text-neutral-800 font-mono tabular-nums">{recipe.nutritionPerServing.protein}g</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px]">Carbs</span>
              <span className="font-semibold text-neutral-800 font-mono tabular-nums">{recipe.nutritionPerServing.carbs}g</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px]">Fats</span>
              <span className="font-semibold text-neutral-800 font-mono tabular-nums">{recipe.nutritionPerServing.fat}g</span>
            </div>
          </div>
        </div>

        {/* Expandable Recipe Details Accordion */}
        <div className="mt-3 pt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-xs font-medium text-emerald-700 hover:text-emerald-800 py-1 transition-colors"
          >
            <span>{isExpanded ? 'Hide Details' : `View ${recipe.ingredients.length} Ingredients & Steps`}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isExpanded && (
            <div className="mt-2.5 pt-2 border-t border-neutral-100 text-xs text-neutral-700">
              {/* Tabs */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                    activeTab === 'ingredients'
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  Ingredients ({recipe.ingredients.length})
                </button>
                <button
                  onClick={() => setActiveTab('steps')}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                    activeTab === 'steps'
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  Preparation ({recipe.instructions.length})
                </button>
              </div>

              {activeTab === 'ingredients' ? (
                <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {recipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-center justify-between py-0.5 border-b border-neutral-50 last:border-none">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-neutral-800">{ing.name}</span>
                        {ing.isPantryStaple && (
                          <span className="text-[10px] text-neutral-400">· staple</span>
                        )}
                      </div>
                      <span className="font-mono text-neutral-500 shrink-0">
                        {ing.quantity} {ing.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ol className="space-y-2 max-h-48 overflow-y-auto pr-1 list-decimal list-inside text-neutral-600">
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <span className="text-neutral-800">{step}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
