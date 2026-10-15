import React from 'react';
import { CuisineType, DietaryRestriction, Ingredient, Recipe } from '../types';
import { X, Upload, Plus, FileText, CheckCircle2, Sparkles } from 'lucide-react';
import salmonBowlImg from '../assets/images/recipe_salmon_bowl_1792051278540.jpg';

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecipe: (recipe: Recipe) => void;
}

export const AddRecipeModal: React.FC<AddRecipeModalProps> = ({
  isOpen,
  onClose,
  onAddRecipe,
}) => {
  const [mode, setMode] = React.useState<'paste' | 'manual'>('paste');
  const [rawText, setRawText] = React.useState<string>(`Honey Garlic Glazed Pork Tenderloin
Cuisine: Asian
Prep Time: 15 mins
Cook Time: 20 mins
Servings: 2

Ingredients:
- 400g Pork Tenderloin ($5.50)
- 250g Fresh Broccoli ($2.00)
- 4 cloves Garlic ($0.50)
- 30ml Honey ($0.80)
- 30ml Low Sodium Soy Sauce ($0.60)
- 180g Jasmine Rice ($0.90)

Instructions:
1. Cut pork tenderloin into 1-inch medallions and season with salt and pepper.
2. Whisk honey, minced garlic, and soy sauce in a small bowl.
3. Sear pork medallions in olive oil for 3-4 mins each side until browned.
4. Pour glaze over pork and simmer until sticky and thickened.
5. Steam broccoli florets and serve with pork over warm jasmine rice.`);

  const [title, setTitle] = React.useState('');
  const [cuisine, setCuisine] = React.useState<CuisineType>('Asian');
  const [prepTime, setPrepTime] = React.useState(15);
  const [cookTime, setCookTime] = React.useState(20);
  const [servings, setServings] = React.useState(2);
  const [ingredientsText, setIngredientsText] = React.useState('');
  const [instructionsText, setInstructionsText] = React.useState('');

  if (!isOpen) return null;

  const handleParseRawText = () => {
    // Intelligent heuristic parser for pasted recipes
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    const parsedTitle = lines[0] || 'Custom Home Recipe';
    
    let parsedCuisine: CuisineType = 'Asian';
    let parsedPrep = 15;
    let parsedCook = 20;
    let parsedServings = 2;
    const parsedIngredients: Ingredient[] = [];
    const parsedInstructions: string[] = [];

    let section: 'meta' | 'ing' | 'steps' = 'meta';

    lines.slice(1).forEach(line => {
      const lower = line.toLowerCase();
      if (lower.startsWith('ingredients:')) {
        section = 'ing';
        return;
      }
      if (lower.startsWith('instructions:') || lower.startsWith('steps:') || lower.startsWith('directions:')) {
        section = 'steps';
        return;
      }

      if (section === 'meta') {
        if (lower.includes('cuisine:')) {
          const match = line.split(':')[1]?.trim() as CuisineType;
          if (match) parsedCuisine = match;
        } else if (lower.includes('prep time:')) {
          const m = line.match(/\d+/);
          if (m) parsedPrep = parseInt(m[0], 10);
        } else if (lower.includes('cook time:')) {
          const m = line.match(/\d+/);
          if (m) parsedCook = parseInt(m[0], 10);
        } else if (lower.includes('servings:')) {
          const m = line.match(/\d+/);
          if (m) parsedServings = parseInt(m[0], 10);
        }
      } else if (section === 'ing') {
        // e.g. "- 400g Pork Tenderloin ($5.50)" or "350g Chicken Breast"
        const clean = line.replace(/^[-*•\d+.]\s*/, '').trim();
        if (clean) {
          const matchUnit = clean.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?\s+(.+)$/);
          let amount = 1;
          let unit = 'unit';
          let name = clean;
          let price = 2.0;

          if (matchUnit) {
            amount = parseFloat(matchUnit[1]) || 1;
            unit = matchUnit[2] || 'unit';
            name = matchUnit[3];
          }

          const priceMatch = name.match(/\(\$([0-9.]+)\)/);
          if (priceMatch) {
            price = parseFloat(priceMatch[1]) || 2.0;
            name = name.replace(/\(\$([0-9.]+)\)/, '').trim();
          }

          let category: Ingredient['category'] = 'Produce & Herbs';
          const nLower = name.toLowerCase();
          if (nLower.includes('chicken') || nLower.includes('beef') || nLower.includes('pork') || nLower.includes('salmon') || nLower.includes('fish') || nLower.includes('meat') || nLower.includes('shrimp')) {
            category = 'Meat & Seafood';
          } else if (nLower.includes('rice') || nLower.includes('pasta') || nLower.includes('noodle') || nLower.includes('flour') || nLower.includes('bean') || nLower.includes('quinoa')) {
            category = 'Pantry & Grains';
          } else if (nLower.includes('sauce') || nLower.includes('oil') || nLower.includes('honey') || nLower.includes('pepper') || nLower.includes('salt') || nLower.includes('spice')) {
            category = 'Spices & Condiments';
          } else if (nLower.includes('cheese') || nLower.includes('cream') || nLower.includes('milk') || nLower.includes('butter') || nLower.includes('yogurt')) {
            category = 'Dairy & Refrigerated';
          }

          parsedIngredients.push({
            id: `custom-ing-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name,
            amount,
            unit,
            category,
            estimatedPrice: price,
          });
        }
      } else if (section === 'steps') {
        const clean = line.replace(/^\d+[\.\)]\s*/, '').trim();
        if (clean) parsedInstructions.push(clean);
      }
    });

    const totalEst = parsedIngredients.reduce((acc, curr) => acc + curr.estimatedPrice, 0);
    const newRecipe: Recipe = {
      id: `recipe-custom-${Date.now()}`,
      title: parsedTitle,
      description: `Uploaded home-cooked recipe: ${parsedTitle}`,
      cuisine: parsedCuisine,
      dietary: ['High-Protein'],
      prepTimeMinutes: parsedPrep,
      cookTimeMinutes: parsedCook,
      servings: parsedServings,
      caloriesPerServing: 520,
      proteinGrams: 38,
      carbsGrams: 45,
      fatGrams: 18,
      costPerServing: Math.round((totalEst / parsedServings) * 100) / 100 || 5.00,
      imageUrl: salmonBowlImg,
      ingredients: parsedIngredients.length > 0 ? parsedIngredients : [
        { id: 'custom-1', name: 'Fresh Vegetables', amount: 250, unit: 'g', category: 'Produce & Herbs', estimatedPrice: 2.0 },
        { id: 'custom-2', name: 'Protein of choice', amount: 350, unit: 'g', category: 'Meat & Seafood', estimatedPrice: 5.0 },
      ],
      instructions: parsedInstructions.length > 0 ? parsedInstructions : [
        'Prepare all fresh ingredients and season proteins with salt and pepper.',
        'Cook proteins and vegetables according to preferred pan sear or roast technique.',
        'Serve warm with accompanying carbs or grain bowl.'
      ],
      keyPerishable: parsedIngredients.find(i => i.category === 'Produce & Herbs')?.name || 'Fresh Produce',
    };

    onAddRecipe(newRecipe);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-neutral-200">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-700" />
              <span>Upload or Paste Weekly Recipe</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Paste recipe text from websites, notes, or cookbooks. Mise will auto-extract units and consolidate into your grocer cart.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-lg w-fit">
            <button
              onClick={() => setMode('paste')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                mode === 'paste'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Smart Text / Document Paste
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Recipe Text & Ingredient Breakdown
            </label>
            <textarea
              rows={12}
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              className="w-full text-xs font-mono p-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 leading-relaxed bg-neutral-50/50"
              placeholder="Paste recipe name, ingredients with grams/units, and instructions here..."
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              Supports grams (g), milliliters (ml), pieces (pc), cloves, cans. Mise calculates consolidated weights to reduce surplus purchases.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-neutral-100 flex items-center justify-between bg-neutral-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleParseRawText}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Parse & Consolidate Recipe</span>
          </button>
        </div>
      </div>
    </div>
  );
};
