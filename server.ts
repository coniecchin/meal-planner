import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback curated recipes tailored to busy working adults & Singapore / global grocers
const FALLBACK_RECIPES = [
  {
    id: 'rec-1',
    title: 'Pan-Seared Salmon Quinoa & Edamame Bowl',
    description: 'Crisp salmon fillet with fluffy quinoa, steamed edamame, avocado, and ponzu sesame dressing.',
    prepTimeMins: 15,
    cookTimeMins: 15,
    servings: 2,
    cuisine: 'Healthy Fusion',
    dietaryTags: ['High Protein', 'Gluten-Free', 'Omega-3'],
    image: '/src/assets/images/recipe_salmon_bowl_1792051827374.jpg',
    nutritionPerServing: { calories: 540, protein: 38, carbs: 42, fat: 22 },
    ingredients: [
      { name: 'Fresh Atlantic Salmon Fillet', quantity: 300, unit: 'g', aisle: 'Meat & Seafood', estimatedPrice: 9.50 },
      { name: 'White Quinoa', quantity: 150, unit: 'g', aisle: 'Pantry & Grains', estimatedPrice: 2.20 },
      { name: 'Shelled Edamame', quantity: 120, unit: 'g', aisle: 'Frozen & Chilled', estimatedPrice: 1.80 },
      { name: 'Ripe Hass Avocado', quantity: 1, unit: 'pc', aisle: 'Fresh Produce', estimatedPrice: 1.90 },
      { name: 'Red Radishes', quantity: 3, unit: 'pcs', aisle: 'Fresh Produce', estimatedPrice: 1.10 },
      { name: 'Japanese Soy Sauce', quantity: 2, unit: 'tbsp', aisle: 'Pantry & Condiments', estimatedPrice: 0.50, isPantryStaple: true },
      { name: 'Sesame Oil', quantity: 1, unit: 'tbsp', aisle: 'Pantry & Condiments', estimatedPrice: 0.40, isPantryStaple: true },
      { name: 'Lemon', quantity: 1, unit: 'pc', aisle: 'Fresh Produce', estimatedPrice: 0.60 }
    ],
    instructions: [
      'Rinse quinoa and simmer in 300ml water with a pinch of salt for 14 minutes until fluffy.',
      'Season salmon fillet with salt, black pepper, and 1 tsp olive oil.',
      'Sear salmon in a hot skillet for 4 mins skin-side down, flip and cook 3 mins until golden.',
      'Steam edamame for 3 minutes. Thinly slice radishes and avocado.',
      'Assemble bowls: base of warm quinoa, top with salmon, avocado slices, edamame, and radishes. Drizzle with soy sauce and sesame oil.'
    ]
  },
  {
    id: 'rec-2',
    title: 'Fragrant Coconut Lime Chickpea & Veggie Curry',
    description: 'Creamy 20-minute coconut milk curry with tender vegetables, chickpeas, and jasmine rice.',
    prepTimeMins: 10,
    cookTimeMins: 20,
    servings: 2,
    cuisine: 'Southeast Asian',
    dietaryTags: ['Vegetarian', 'Dairy-Free', 'Fuss-Free'],
    image: '/src/assets/images/recipe_thai_curry_1792051828102.jpg',
    nutritionPerServing: { calories: 480, protein: 18, carbs: 62, fat: 18 },
    ingredients: [
      { name: 'Coconut Milk (Kara or Ayam)', quantity: 400, unit: 'ml', aisle: 'Pantry & Condiments', estimatedPrice: 2.30 },
      { name: 'Organic Chickpeas (canned)', quantity: 400, unit: 'g', aisle: 'Pantry & Grains', estimatedPrice: 1.60 },
      { name: 'Firm Tofu', quantity: 200, unit: 'g', aisle: 'Dairy & Chilled', estimatedPrice: 1.40 },
      { name: 'Yellow Bell Pepper', quantity: 1, unit: 'pc', aisle: 'Fresh Produce', estimatedPrice: 1.50 },
      { name: 'Baby Corn', quantity: 100, unit: 'g', aisle: 'Fresh Produce', estimatedPrice: 1.30 },
      { name: 'Yellow Curry Paste', quantity: 2, unit: 'tbsp', aisle: 'Pantry & Condiments', estimatedPrice: 1.10 },
      { name: 'Jasmine Rice', quantity: 180, unit: 'g', aisle: 'Pantry & Grains', estimatedPrice: 1.00, isPantryStaple: true },
      { name: 'Fresh Coriander', quantity: 1, unit: 'bunch', aisle: 'Fresh Produce', estimatedPrice: 0.90 },
      { name: 'Lime', quantity: 1, unit: 'pc', aisle: 'Fresh Produce', estimatedPrice: 0.50 }
    ],
    instructions: [
      'Cook jasmine rice according to package directions.',
      'In a deep skillet, warm curry paste in 1 tbsp coconut cream until aromatic (1 min).',
      'Cube tofu and lightly brown in the curry paste.',
      'Pour in remaining coconut milk, drained chickpeas, sliced bell pepper, and baby corn. Simmer gently for 12 minutes.',
      'Stir in fresh lime juice. Serve steaming hot over jasmine rice topped with fresh coriander.'
    ]
  },
  {
    id: 'rec-3',
    title: '15-Minute Garlic Herb Butter Prawn Linguine',
    description: 'Quick weeknight Italian classic with succulent prawns, garlic, cherry tomatoes, and baby spinach.',
    prepTimeMins: 5,
    cookTimeMins: 12,
    servings: 2,
    cuisine: 'Mediterranean',
    dietaryTags: ['Quick 20-min', 'Pescatarian'],
    image: '/src/assets/images/hero_culinary_prep_1792051827185.jpg',
    nutritionPerServing: { calories: 510, protein: 32, carbs: 58, fat: 16 },
    ingredients: [
      { name: 'Linguine Pasta', quantity: 200, unit: 'g', aisle: 'Pantry & Grains', estimatedPrice: 1.80 },
      { name: 'Peeled Tiger Prawns', quantity: 250, unit: 'g', aisle: 'Meat & Seafood', estimatedPrice: 7.90 },
      { name: 'Cherry Tomatoes', quantity: 150, unit: 'g', aisle: 'Fresh Produce', estimatedPrice: 1.80 },
      { name: 'Baby Spinach', quantity: 100, unit: 'g', aisle: 'Fresh Produce', estimatedPrice: 1.90 },
      { name: 'Garlic Cloves', quantity: 5, unit: 'cloves', aisle: 'Fresh Produce', estimatedPrice: 0.60, isPantryStaple: true },
      { name: 'Extra Virgin Olive Oil', quantity: 2, unit: 'tbsp', aisle: 'Pantry & Condiments', estimatedPrice: 0.70, isPantryStaple: true },
      { name: 'Salted Butter', quantity: 25, unit: 'g', aisle: 'Dairy & Chilled', estimatedPrice: 0.80 },
      { name: 'Chili Flakes & Sea Salt', quantity: 1, unit: 'tsp', aisle: 'Pantry & Condiments', estimatedPrice: 0.30, isPantryStaple: true }
    ],
    instructions: [
      'Boil linguine in heavily salted water for 9 minutes until al dente. Reserve 1/4 cup pasta water.',
      'Heat olive oil and butter in a wide pan over medium heat. Add thinly sliced garlic and chili flakes, cook 1 min until fragrant.',
      'Add prawns and cherry tomatoes. Sauté for 3 minutes until prawns turn pink and tomatoes begin to blister.',
      'Toss drained pasta and baby spinach into the pan with 2 tbsp pasta water. Cook 1 minute until spinach wilts and sauce emulsifies.',
      'Plate with fresh cracked black pepper and a drizzle of olive oil.'
    ]
  },
  {
    id: 'rec-4',
    title: 'Ginger Scallion Chicken Rice Bowl with Bok Choy',
    description: 'Tender poached chicken breasts drizzled with sizzling ginger scallion oil over fragrant rice and greens.',
    prepTimeMins: 10,
    cookTimeMins: 18,
    servings: 2,
    cuisine: 'Asian Comfort',
    dietaryTags: ['High Protein', 'Dairy-Free'],
    image: '/src/assets/images/recipe_salmon_bowl_1792051827374.jpg',
    nutritionPerServing: { calories: 530, protein: 44, carbs: 54, fat: 14 },
    ingredients: [
      { name: 'Chicken Breast Fillets', quantity: 350, unit: 'g', aisle: 'Meat & Seafood', estimatedPrice: 5.80 },
      { name: 'Fresh Ginger Root', quantity: 40, unit: 'g', aisle: 'Fresh Produce', estimatedPrice: 0.70 },
      { name: 'Spring Onions (Scallions)', quantity: 3, unit: 'stalks', aisle: 'Fresh Produce', estimatedPrice: 0.80 },
      { name: 'Baby Bok Choy', quantity: 200, unit: 'g', aisle: 'Fresh Produce', estimatedPrice: 1.40 },
      { name: 'Jasmine Rice', quantity: 180, unit: 'g', aisle: 'Pantry & Grains', estimatedPrice: 1.00, isPantryStaple: true },
      { name: 'Sesame Oil', quantity: 1, unit: 'tbsp', aisle: 'Pantry & Condiments', estimatedPrice: 0.40, isPantryStaple: true },
      { name: 'Light Soy Sauce', quantity: 2, unit: 'tbsp', aisle: 'Pantry & Condiments', estimatedPrice: 0.50, isPantryStaple: true }
    ],
    instructions: [
      'Poach chicken breasts gently in simmering water with ginger slices for 14 minutes. Let rest and slice.',
      'Finely mince remaining ginger and scallions. Pour hot oil over them in a heatproof bowl, add salt and sesame oil.',
      'Blanch bok choy in hot chicken poaching liquid for 90 seconds.',
      'Serve sliced chicken over warm jasmine rice with blanched greens and generous spoonfuls of ginger scallion relish.'
    ]
  },
  {
    id: 'rec-5',
    title: 'Mediterranean Sheet Pan Chicken & Rainbow Peppers',
    description: 'Zero-effort one-pan roast chicken with bell peppers, red onion, zucchini, oregano, and crumbled feta.',
    prepTimeMins: 10,
    cookTimeMins: 25,
    servings: 2,
    cuisine: 'Mediterranean',
    dietaryTags: ['Low Carb', 'Gluten-Free', 'Fuss-Free'],
    image: '/src/assets/images/hero_culinary_prep_1792051827185.jpg',
    nutritionPerServing: { calories: 460, protein: 42, carbs: 16, fat: 24 },
    ingredients: [
      { name: 'Boneless Chicken Thighs', quantity: 350, unit: 'g', aisle: 'Meat & Seafood', estimatedPrice: 5.40 },
      { name: 'Red & Green Bell Peppers', quantity: 2, unit: 'pcs', aisle: 'Fresh Produce', estimatedPrice: 2.20 },
      { name: 'Red Onion', quantity: 1, unit: 'pc', aisle: 'Fresh Produce', estimatedPrice: 0.80 },
      { name: 'Zucchini', quantity: 1, unit: 'pc', aisle: 'Fresh Produce', estimatedPrice: 1.20 },
      { name: 'Greek Feta Cheese', quantity: 80, unit: 'g', aisle: 'Dairy & Chilled', estimatedPrice: 2.50 },
      { name: 'Dried Oregano & Thyme', quantity: 1, unit: 'tbsp', aisle: 'Pantry & Condiments', estimatedPrice: 0.40, isPantryStaple: true },
      { name: 'Olive Oil', quantity: 2, unit: 'tbsp', aisle: 'Pantry & Condiments', estimatedPrice: 0.70, isPantryStaple: true }
    ],
    instructions: [
      'Preheat oven to 200°C (400°F).',
      'Cut chicken thighs, peppers, red onion, and zucchini into bite-sized chunks.',
      'Toss everything directly on a large baking sheet with olive oil, oregano, salt, and black pepper.',
      'Roast for 22-25 minutes until chicken is cooked through and vegetables are caramelized.',
      'Crumble Greek feta over the hot tray and serve immediately.'
    ]
  }
];

// POST /api/generate-meal-plan
app.post('/api/generate-meal-plan', async (req, res) => {
  try {
    const {
      days = 5,
      pax = 2,
      budget = 90,
      currency = 'SGD',
      cuisines = ['Asian', 'Mediterranean'],
      dietary = ['Quick 20-min', 'Balanced'],
      allergies = [],
      goal = 'Reduce mental load & maximize pantry efficiency'
    } = req.body;

    if (!ai) {
      // Return structured fallback tailored to parameters
      const selectedRecipes = FALLBACK_RECIPES.slice(0, Math.min(days, FALLBACK_RECIPES.length));
      return res.json({
        success: true,
        source: 'curated_library',
        message: 'Plan generated with chef-curated weeknight recipes optimized for grocery delivery.',
        plan: {
          days,
          pax,
          estimatedTotalCost: selectedRecipes.reduce((sum, r) => sum + r.ingredients.reduce((s, i) => s + i.estimatedPrice, 0), 0),
          currency,
          recipes: selectedRecipes
        }
      });
    }

    const prompt = `You are the executive culinary AI for PrepCart.
Generate a structured weekly meal plan for ${days} days for ${pax} person(s).
Budget constraint: Approx ${budget} ${currency}.
Cuisine preferences: ${cuisines.join(', ') || 'Varied healthy weeknight'}.
Dietary requirements: ${dietary.join(', ') || 'Nutritious, fuss-free'}.
Allergies or exclusions: ${allergies.join(', ') || 'None'}.
User goal: ${goal}.

CRITICAL REQUIREMENTS:
1. Provide realistic recipes that share common core ingredients to dramatically reduce food waste (e.g. herbs, greens, onions used across 2+ meals).
2. For each recipe, list ingredients with precise quantities, units (g, ml, pc, tbsp, etc.), aisle classification ('Fresh Produce', 'Meat & Seafood', 'Dairy & Chilled', 'Pantry & Grains', 'Pantry & Condiments', 'Bakery', 'Frozen & Chilled'), realistic unit cost in ${currency}, and whether it's a common pantry staple.
3. Accurate nutritional estimate per serving (calories, protein, carbs, fat).
4. Concise, practical step-by-step instructions (3-5 steps max, under 30 mins active cooking for busy working adults).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planSummary: { type: Type.STRING },
            wasteReductionTip: { type: Type.STRING },
            recipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  prepTimeMins: { type: Type.NUMBER },
                  cookTimeMins: { type: Type.NUMBER },
                  servings: { type: Type.NUMBER },
                  cuisine: { type: Type.STRING },
                  dietaryTags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  nutritionPerServing: {
                    type: Type.OBJECT,
                    properties: {
                      calories: { type: Type.NUMBER },
                      protein: { type: Type.NUMBER },
                      carbs: { type: Type.NUMBER },
                      fat: { type: Type.NUMBER },
                    },
                    required: ['calories', 'protein', 'carbs', 'fat']
                  },
                  ingredients: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        quantity: { type: Type.NUMBER },
                        unit: { type: Type.STRING },
                        aisle: { type: Type.STRING },
                        estimatedPrice: { type: Type.NUMBER },
                        isPantryStaple: { type: Type.BOOLEAN }
                      },
                      required: ['name', 'quantity', 'unit', 'aisle', 'estimatedPrice', 'isPantryStaple']
                    }
                  },
                  instructions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ['id', 'title', 'description', 'prepTimeMins', 'cookTimeMins', 'servings', 'cuisine', 'dietaryTags', 'nutritionPerServing', 'ingredients', 'instructions']
              }
            }
          },
          required: ['planSummary', 'wasteReductionTip', 'recipes']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    // Attach default fallback image to generated recipes
    const images = [
      '/src/assets/images/recipe_salmon_bowl_1792051827374.jpg',
      '/src/assets/images/recipe_thai_curry_1792051828102.jpg',
      '/src/assets/images/hero_culinary_prep_1792051827185.jpg',
      '/src/assets/images/grocer_delivery_basket_1792051829605.jpg'
    ];

    if (parsed.recipes && Array.isArray(parsed.recipes)) {
      parsed.recipes.forEach((rec: any, idx: number) => {
        rec.image = images[idx % images.length];
      });
    }

    res.json({
      success: true,
      source: 'gemini-3.8-flash',
      planSummary: parsed.planSummary,
      wasteReductionTip: parsed.wasteReductionTip,
      plan: {
        days,
        pax,
        currency,
        recipes: parsed.recipes || FALLBACK_RECIPES.slice(0, days)
      }
    });
  } catch (err: any) {
    console.error('Error in /api/generate-meal-plan:', err);
    res.json({
      success: true,
      source: 'curated_fallback',
      warning: 'Switched to offline culinary catalog due to service timeout: ' + (err.message || 'unknown'),
      plan: {
        days: 5,
        pax: 2,
        currency: 'SGD',
        recipes: FALLBACK_RECIPES
      }
    });
  }
});

// POST /api/parse-recipe
// Allows users to paste any unstructured recipe text, link notes, or ingredient list (Slide 3)
app.post('/api/parse-recipe', async (req, res) => {
  try {
    const { recipeText, title = 'Uploaded Recipe' } = req.body;
    if (!recipeText) {
      return res.status(400).json({ error: 'recipeText is required' });
    }

    if (!ai) {
      // Simple rule-based parser fallback
      const lines = recipeText.split('\n').filter((l: string) => l.trim().length > 0);
      const ingredients = lines.slice(0, 8).map((line: string, i: number) => ({
        name: line.replace(/^[-*•\d.]+\s*/, '').trim(),
        quantity: 1,
        unit: 'pack',
        aisle: 'Fresh Produce',
        estimatedPrice: 2.50,
        isPantryStaple: false
      }));

      return res.json({
        success: true,
        recipe: {
          id: 'uploaded-' + Date.now(),
          title: title || 'Custom Recipe',
          description: 'Parsed from user recipe notes',
          prepTimeMins: 15,
          cookTimeMins: 20,
          servings: 2,
          cuisine: 'Custom',
          dietaryTags: ['User Created'],
          image: '/src/assets/images/hero_culinary_prep_1792051827185.jpg',
          nutritionPerServing: { calories: 450, protein: 25, carbs: 40, fat: 18 },
          ingredients,
          instructions: lines.slice(8).length ? lines.slice(8) : ['Prepare all ingredients according to recipe', 'Cook over medium heat until ready']
        }
      });
    }

    const prompt = `You are a culinary ingredient extractor. Parse this user-submitted recipe notes into a normalized recipe with structured ingredients, quantities, standard units, grocery aisle, estimated SGD/USD price, and instructions.
Raw recipe text:
"""
${recipeText}
"""`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            prepTimeMins: { type: Type.NUMBER },
            cookTimeMins: { type: Type.NUMBER },
            servings: { type: Type.NUMBER },
            cuisine: { type: Type.STRING },
            dietaryTags: { type: Type.ARRAY, items: { type: Type.STRING } },
            nutritionPerServing: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fat: { type: Type.NUMBER }
              },
              required: ['calories', 'protein', 'carbs', 'fat']
            },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  aisle: { type: Type.STRING },
                  estimatedPrice: { type: Type.NUMBER },
                  isPantryStaple: { type: Type.BOOLEAN }
                },
                required: ['name', 'quantity', 'unit', 'aisle', 'estimatedPrice', 'isPantryStaple']
              }
            },
            instructions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['title', 'ingredients', 'instructions']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      success: true,
      recipe: {
        id: 'uploaded-' + Date.now(),
        title: parsed.title || title || 'Custom Recipe',
        description: parsed.description || 'Parsed from user recipe notes',
        prepTimeMins: parsed.prepTimeMins || 15,
        cookTimeMins: parsed.cookTimeMins || 20,
        servings: parsed.servings || 2,
        cuisine: parsed.cuisine || 'Home Recipe',
        dietaryTags: parsed.dietaryTags || ['Custom Recipe'],
        image: '/src/assets/images/hero_culinary_prep_1792051827185.jpg',
        nutritionPerServing: parsed.nutritionPerServing || { calories: 480, protein: 28, carbs: 45, fat: 16 },
        ingredients: parsed.ingredients || [],
        instructions: parsed.instructions || ['Cook ingredients thoroughly.']
      }
    });
  } catch (err: any) {
    console.error('Error in /api/parse-recipe:', err);
    res.status(500).json({ error: err.message || 'Failed to parse recipe' });
  }
});

// Helper functions to parse TheMealDB measure and classify aisle
function parseMealMeasure(measure: string | null | undefined): { quantity: number; unit: string } {
  if (!measure || !measure.trim()) return { quantity: 1, unit: 'portion' };
  const trimmed = measure.trim();
  const match = trimmed.match(/^([\d\s\/\.\-]+)\s*([a-zA-Z]+)?/);
  if (match) {
    const numStr = match[1].trim();
    const unit = match[2] ? match[2].trim().toLowerCase() : '';
    let qty = 1;
    if (numStr.includes('/')) {
      const parts = numStr.split('/');
      qty = (parseFloat(parts[0]) || 1) / (parseFloat(parts[1]) || 1);
    } else {
      qty = parseFloat(numStr) || 1;
    }
    return { quantity: Math.round(qty * 10) / 10, unit: unit || 'item' };
  }
  return { quantity: 1, unit: trimmed };
}

function classifyAisleAndStaple(ingredientName: string): { aisle: string; isPantryStaple: boolean; estimatedPrice: number } {
  const name = ingredientName.toLowerCase();
  if (
    name.includes('chicken') ||
    name.includes('beef') ||
    name.includes('pork') ||
    name.includes('salmon') ||
    name.includes('prawn') ||
    name.includes('bacon') ||
    name.includes('fish') ||
    name.includes('fillet') ||
    name.includes('meat')
  ) {
    return { aisle: 'Meat & Seafood', isPantryStaple: false, estimatedPrice: 6.80 };
  }
  if (
    name.includes('cheese') ||
    name.includes('butter') ||
    name.includes('milk') ||
    name.includes('cream') ||
    name.includes('feta') ||
    name.includes('yogurt') ||
    name.includes('tofu') ||
    name.includes('egg')
  ) {
    return { aisle: 'Dairy & Chilled', isPantryStaple: name.includes('butter') || name.includes('egg'), estimatedPrice: 2.80 };
  }
  if (
    name.includes('quinoa') ||
    name.includes('rice') ||
    name.includes('pasta') ||
    name.includes('flour') ||
    name.includes('chickpea') ||
    name.includes('couscous') ||
    name.includes('noodle') ||
    name.includes('lentil') ||
    name.includes('bread')
  ) {
    return { aisle: 'Pantry & Grains', isPantryStaple: true, estimatedPrice: 1.90 };
  }
  if (
    name.includes('oil') ||
    name.includes('salt') ||
    name.includes('pepper') ||
    name.includes('sauce') ||
    name.includes('vinegar') ||
    name.includes('sugar') ||
    name.includes('paste') ||
    name.includes('honey') ||
    name.includes('mustard') ||
    name.includes('cumin') ||
    name.includes('oregano') ||
    name.includes('paprika') ||
    name.includes('chili') ||
    name.includes('curry') ||
    name.includes('dressing')
  ) {
    return { aisle: 'Pantry & Condiments', isPantryStaple: true, estimatedPrice: 1.20 };
  }
  return { aisle: 'Fresh Produce', isPantryStaple: name.includes('garlic') || name.includes('onion'), estimatedPrice: 1.50 };
}

// GET /api/meals/filter: Serverless proxy to TheMealDB keyless API (filters by chicken_breast or custom ingredient)
app.get('/api/meals/filter', async (req, res) => {
  try {
    const ingredient = (req.query.i as string) || 'chicken_breast';
    const targetUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`;
    
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`TheMealDB API returned status ${response.status}`);
    }

    const data = await response.json();
    res.json({
      success: true,
      sourceUrl: targetUrl,
      ingredient,
      meals: data.meals || []
    });
  } catch (err: any) {
    console.error('Error fetching from TheMealDB filter:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to fetch meals from TheMealDB'
    });
  }
});

// GET /api/meals/detail/:id: Fetches full meal details and normalizes into PrepCart Recipe
app.get('/api/meals/detail/:id', async (req, res) => {
  try {
    const mealId = req.params.id;
    const targetUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(mealId)}`;
    
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`TheMealDB lookup returned status ${response.status}`);
    }

    const data = await response.json();
    const rawMeal = data.meals?.[0];
    if (!rawMeal) {
      return res.status(404).json({ error: 'Meal not found in TheMealDB' });
    }

    // Extract ingredients & measures from strIngredient1..20 and strMeasure1..20
    const ingredients: any[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingName = rawMeal[`strIngredient${i}`];
      const measure = rawMeal[`strMeasure${i}`];
      if (ingName && ingName.trim()) {
        const { quantity, unit } = parseMealMeasure(measure);
        const { aisle, isPantryStaple, estimatedPrice } = classifyAisleAndStaple(ingName.trim());
        ingredients.push({
          name: ingName.trim(),
          quantity,
          unit,
          aisle,
          estimatedPrice,
          isPantryStaple
        });
      }
    }

    // Split instructions into digestible steps
    const rawInstructions: string = rawMeal.strInstructions || '';
    const instructionSteps = rawInstructions
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(s => s.length > 10 && !s.toLowerCase().startsWith('step'));

    const instructions = instructionSteps.length > 0
      ? instructionSteps
      : ['Follow standard culinary preparation for ' + rawMeal.strMeal];

    const normalizedRecipe = {
      id: 'themealdb-' + rawMeal.idMeal,
      title: rawMeal.strMeal,
      description: `${rawMeal.strArea || rawMeal.strCountry || 'International'} style ${rawMeal.strCategory || 'dish'} from TheMealDB open culinary catalog.`,
      prepTimeMins: 15,
      cookTimeMins: 20,
      servings: 2,
      cuisine: rawMeal.strArea || rawMeal.strCountry || 'International',
      dietaryTags: [rawMeal.strCategory || 'Fresh Meal', 'TheMealDB Live'],
      image: rawMeal.strMealThumb || '/src/assets/images/recipe_salmon_bowl_1792051827374.jpg',
      nutritionPerServing: {
        calories: 520,
        protein: 42,
        carbs: 38,
        fat: 18
      },
      ingredients,
      instructions,
      source: 'themealdb',
      externalUrl: rawMeal.strSource || rawMeal.strYoutube || null
    };

    res.json({
      success: true,
      recipe: normalizedRecipe
    });
  } catch (err: any) {
    console.error('Error in /api/meals/detail:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch meal details' });
  }
});


// Serve static image assets in both development and production
app.use('/images', express.static(path.resolve(__dirname, 'public/images')));
app.use('/src/assets/images', express.static(path.resolve(__dirname, 'src/assets/images')));
app.use(express.static(path.resolve(__dirname, 'public')));

// Start server with Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`PrepCart server listening on port ${PORT}`);
  });
}

startServer();
