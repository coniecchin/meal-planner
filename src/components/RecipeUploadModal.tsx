import React, { useState } from 'react';
import { X, Sparkles, FileText, CheckCircle, Upload, ArrowRight, Loader2 } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddParsedRecipe: (recipe: Recipe) => void;
}

export const RecipeUploadModal: React.FC<RecipeUploadModalProps> = ({
  isOpen,
  onClose,
  onAddParsedRecipe
}) => {
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeText, setRecipeText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const sampleRecipes = [
    {
      label: 'Garlic Butter Tuscan Chicken',
      text: `Garlic Butter Tuscan Chicken (2 servings)
Ingredients:
- 300g chicken breast cutlets
- 100g baby spinach
- 100g cherry tomatoes
- 100ml heavy cream or coconut cream
- 4 cloves garlic, minced
- 1 tbsp olive oil
- 1 tsp Italian herb seasoning
- Salt and black pepper

Instructions:
1. Season chicken with salt, pepper, and Italian herbs.
2. Sear in olive oil for 5 minutes each side until golden and cooked through. Remove to plate.
3. Sauté garlic and cherry tomatoes for 2 minutes until tomatoes blister.
4. Pour in heavy cream and toss baby spinach until wilted.
5. Return chicken to pan and spoon creamy sauce over before serving.`
    },
    {
      label: 'Crispy Honey Sesame Tofu Bowl',
      text: `Crispy Honey Sesame Tofu Bowl (2 servings)
Ingredients:
- 300g firm tofu (cubed)
- 2 tbsp cornstarch
- 2 tbsp soy sauce
- 1 tbsp honey or maple syrup
- 1 tbsp toasted sesame oil
- 1 tbsp sesame seeds
- 1 head broccoli florets
- 180g brown rice

Instructions:
1. Cook brown rice in 360ml water until tender.
2. Toss cubed tofu in cornstarch and pan fry in oil until crispy on all sides (8 mins).
3. Steam broccoli florets for 4 minutes.
4. Whisk soy sauce, honey, and sesame oil, then pour over crispy tofu to glaze.
5. Serve glazed tofu over brown rice with steamed broccoli and sprinkle sesame seeds.`
    }
  ];

  const handleParse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeText.trim()) {
      setErrorMessage('Please paste or enter recipe ingredients and steps.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/parse-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: recipeTitle.trim() || undefined,
          recipeText: recipeText.trim()
        })
      });

      const data = await res.json();
      if (data.recipe) {
        onAddParsedRecipe(data.recipe);
        onClose();
      } else {
        throw new Error(data.error || 'Failed to parse recipe');
      }
    } catch (err: any) {
      console.error('Recipe parsing error:', err);
      setErrorMessage(err.message || 'Error processing recipe. Please check formatting.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Upload & AI Parse Recipe
              </h3>
              <p className="text-xs text-neutral-500">
                Slide 3 Value Proposition: Paste any recipe text, and AI extracts ingredients with units.
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

        {/* Modal Body */}
        <form onSubmit={handleParse} className="p-5 space-y-4 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              Recipe Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Grandma's Beef Stew, Quick Honey Glazed Salmon"
              value={recipeTitle}
              onChange={(e) => setRecipeTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-neutral-50 focus:bg-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-neutral-700">
                Recipe Content / Ingredients & Instructions
              </label>
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                <span>Quick Fill:</span>
                {sampleRecipes.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setRecipeTitle(sample.label);
                      setRecipeText(sample.text);
                    }}
                    className="text-emerald-700 hover:underline font-medium"
                  >
                    {sample.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows={8}
              placeholder="Paste recipe notes or ingredient list here...&#10;&#10;e.g.&#10;2 chicken breasts&#10;1 bell pepper&#10;1 onion&#10;2 tbsp soy sauce"
              value={recipeText}
              onChange={(e) => setRecipeText(e.target.value)}
              className="w-full p-3 text-xs font-mono border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-neutral-50 focus:bg-white leading-relaxed"
            />
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 text-emerald-900 text-xs flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              AI normalizes all ingredient quantities, separates common pantry staples, maps grocery aisles, and appends to your weekly cart.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Analyzing Ingredients...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Parse & Add to Weekly Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
