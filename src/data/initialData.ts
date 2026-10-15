import { GroceryPartner, PantryItem, Recipe } from '../types';
import { APP_IMAGES } from '../assets/images';

export const GROCERY_PARTNERS: GroceryPartner[] = [
  {
    id: 'redmart',
    name: 'RedMart (Lazada)',
    type: 'scheduled',
    deliveryTime: 'Same Day / Next Day 2-hr slots',
    minSpend: 40,
    deliveryFee: 5.99,
    freeDeliveryThreshold: 60,
    rating: 4.8,
    tagline: 'Best for weekly bulk fresh grocery & bundle savings',
    brandColor: '#e01e2b',
    lightBg: 'bg-red-50 text-red-700 border-red-200'
  },
  {
    id: 'grabmart',
    name: 'GrabMart Express',
    type: 'instant',
    deliveryTime: '25 - 45 mins instant dispatch',
    minSpend: 15,
    deliveryFee: 4.50,
    freeDeliveryThreshold: 45,
    rating: 4.7,
    tagline: 'Instant delivery from supermarkets & local specialty shops',
    brandColor: '#00b14f',
    lightBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'fairprice',
    name: 'FairPrice Online',
    type: 'scheduled',
    deliveryTime: 'Scheduled next morning / evening slots',
    minSpend: 39,
    deliveryFee: 5.50,
    freeDeliveryThreshold: 59,
    rating: 4.6,
    tagline: 'Singapore staple national grocer with fresh wet-market quality',
    brandColor: '#005ea6',
    lightBg: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    id: 'amazon_fresh',
    name: 'Amazon Fresh',
    type: 'scheduled',
    deliveryTime: 'Ultra-fast 2-hour scheduled window',
    minSpend: 30,
    deliveryFee: 6.00,
    freeDeliveryThreshold: 60,
    rating: 4.9,
    tagline: 'Prime 2-hour scheduled delivery for organic & fresh staples',
    brandColor: '#ff9900',
    lightBg: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  {
    id: 'foodpanda',
    name: 'pandamart (Foodpanda)',
    type: 'instant',
    deliveryTime: '15 - 30 mins 24/7 dark store',
    minSpend: 12,
    deliveryFee: 3.99,
    freeDeliveryThreshold: 35,
    rating: 4.6,
    tagline: 'Quick 20-min top-ups for last-minute recipe ingredients',
    brandColor: '#d60b52',
    lightBg: 'bg-pink-50 text-pink-700 border-pink-200'
  }
];

export const INITIAL_PANTRY: PantryItem[] = [
  { id: 'pantry-1', name: 'Extra Virgin Olive Oil', category: 'Oils & Vinegars', inStock: true, quantityRemaining: 'Half bottle' },
  { id: 'pantry-2', name: 'Salt & Black Pepper', category: 'Spices & Seasoning', inStock: true, quantityRemaining: 'Full shaker' },
  { id: 'pantry-3', name: 'Garlic Cloves', category: 'Fresh Aromatics', inStock: true, quantityRemaining: '5 bulbs' },
  { id: 'pantry-4', name: 'Japanese Soy Sauce', category: 'Asian Condiments', inStock: true, quantityRemaining: '3/4 bottle' },
  { id: 'pantry-5', name: 'Sesame Oil', category: 'Asian Condiments', inStock: true, quantityRemaining: 'Half bottle' },
  { id: 'pantry-6', name: 'Jasmine Rice', category: 'Grains & Rice', inStock: true, quantityRemaining: '2 kg bag' },
  { id: 'pantry-7', name: 'Dried Oregano & Thyme', category: 'Herbs & Spices', inStock: true, quantityRemaining: 'Full jar' },
  { id: 'pantry-8', name: 'Chili Flakes & Sea Salt', category: 'Spices & Seasoning', inStock: true, quantityRemaining: '1 jar' },
  { id: 'pantry-9', name: 'Butter', category: 'Dairy & Chilled', inStock: false, quantityRemaining: 'Depleted' },
  { id: 'pantry-10', name: 'Eggs (Pack of 10)', category: 'Dairy & Eggs', inStock: true, quantityRemaining: '6 eggs left' }
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec-1',
    title: 'Pan-Seared Salmon Quinoa & Edamame Bowl',
    description: 'Crisp salmon fillet with fluffy quinoa, steamed edamame, avocado, and ponzu sesame dressing.',
    prepTimeMins: 15,
    cookTimeMins: 15,
    servings: 2,
    cuisine: 'Healthy Fusion',
    dietaryTags: ['High Protein', 'Gluten-Free', 'Omega-3'],
    image: APP_IMAGES.salmonBowl,
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
    image: APP_IMAGES.thaiCurry,
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
    image: APP_IMAGES.hero,
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
  }
];
