// src/services/templates/templates.ts

export type IntentCategory = 'recipe' | 'event' | 'restocking' | 'emergency' | 'snack' | 'general';

export interface TemplateItem {
  name: string;
  category: string;
  defaultQuantity: number;
  basePrice: number;  // INR
  isCore: boolean;    // Core items cannot be removed by AI
  scalingFactor?: number; // How much to scale with group size (default 1)
}

export interface CartTemplate {
  id: string;
  name: string;
  intentCategory: IntentCategory;
  keywords: string[];  // Used for matching
  items: TemplateItem[];
  optionalAddons?: TemplateItem[];
}

export const TEMPLATES: CartTemplate[] = [
  // RECIPE TEMPLATES
  {
    id: 'chicken_biryani',
    name: 'Chicken Biryani',
    intentCategory: 'recipe',
    keywords: ['biryani', 'chicken biryani', 'hyderabadi biryani', 'dum biryani'],
    items: [
      { name: 'Basmati Rice 1kg', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 180, isCore: true, scalingFactor: 0.5 },
      { name: 'Chicken 500g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 250, isCore: true, scalingFactor: 1 },
      { name: 'Onions 1kg', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 40, isCore: true },
      { name: 'Curd 400g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 45, isCore: true },
      { name: 'MDH Biryani Masala 50g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 75, isCore: true },
      { name: 'Fresh Mint Leaves 100g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 20, isCore: true },
      { name: 'Fresh Coriander 100g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 15, isCore: true },
      { name: 'Cooking Oil 1L', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 160, isCore: true },
      { name: 'Green Chillies 100g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 15, isCore: false },
      { name: 'Ginger Garlic Paste 200g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 55, isCore: false },
    ],
    optionalAddons: [
      { name: 'Raita (Curd 200g + Onion)', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 30, isCore: false },
      { name: 'Saffron 1g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 120, isCore: false },
      { name: 'Rose Water 100ml', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 45, isCore: false },
    ],
  },
  {
    id: 'veg_biryani',
    name: 'Veg Biryani',
    intentCategory: 'recipe',
    keywords: ['veg biryani', 'vegetable biryani', 'paneer biryani'],
    items: [
      { name: 'Basmati Rice 1kg', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 180, isCore: true, scalingFactor: 0.5 },
      { name: 'Mixed Vegetables 500g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 80, isCore: true, scalingFactor: 1 },
      { name: 'Paneer 200g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 90, isCore: true },
      { name: 'Onions 1kg', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 40, isCore: true },
      { name: 'Curd 400g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 45, isCore: true },
      { name: 'MDH Biryani Masala 50g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 75, isCore: true },
      { name: 'Fresh Mint Leaves 100g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 20, isCore: true },
      { name: 'Fresh Coriander 100g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 15, isCore: true },
      { name: 'Cooking Oil 1L', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 160, isCore: true },
      { name: 'Ghee 200g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 120, isCore: false },
    ],
    optionalAddons: [
      { name: 'Saffron 1g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 120, isCore: false },
      { name: 'Cashews 100g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 150, isCore: false },
    ],
  },
  {
    id: 'pasta',
    name: 'Pasta',
    intentCategory: 'recipe',
    keywords: ['pasta', 'spaghetti', 'penne', 'making pasta', 'italian'],
    items: [
      { name: 'Pasta (Penne/Spaghetti) 500g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 90, isCore: true, scalingFactor: 0.5 },
      { name: 'Pasta Sauce 400g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 150, isCore: true },
      { name: 'Olive Oil 250ml', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 250, isCore: true },
      { name: 'Garlic 100g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 30, isCore: true },
      { name: 'Cheese (Mozzarella) 200g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 180, isCore: true },
      { name: 'Capsicum 250g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 40, isCore: false },
      { name: 'Mushrooms 200g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 60, isCore: false },
      { name: 'Oregano Seasoning', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 40, isCore: false },
    ],
    optionalAddons: [
      { name: 'Parmesan Cheese 50g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 200, isCore: false },
      { name: 'Garlic Bread (Frozen)', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 120, isCore: false },
    ],
  },
  {
    id: 'chai_snacks',
    name: 'Chai & Snacks',
    intentCategory: 'recipe',
    keywords: ['chai', 'tea', 'evening tea', 'chai time', 'tea time'],
    items: [
      { name: 'Tata Tea Premium 250g', category: 'Beverages', defaultQuantity: 1, basePrice: 130, isCore: true },
      { name: 'Amul Milk 500ml', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 30, isCore: true, scalingFactor: 1 },
      { name: 'Sugar 500g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 40, isCore: true },
      { name: 'Parle-G Biscuits', category: 'Snacks', defaultQuantity: 2, basePrice: 20, isCore: true, scalingFactor: 1 },
      { name: 'Samosa (Frozen) 4pc', category: 'Snacks', defaultQuantity: 1, basePrice: 80, isCore: false, scalingFactor: 1 },
    ],
    optionalAddons: [
      { name: 'Ginger 50g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 10, isCore: false },
      { name: 'Cardamom 10g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 30, isCore: false },
    ],
  },

  // EVENT TEMPLATES
  {
    id: 'movie_night',
    name: 'Movie Night',
    intentCategory: 'event',
    keywords: ['movie night', 'movie', 'watching movie', 'netflix', 'binge watching', 'movie marathon'],
    items: [
      { name: 'ACT II Butter Popcorn (Pack of 3)', category: 'Snacks', defaultQuantity: 1, basePrice: 120, isCore: true, scalingFactor: 0.5 },
      { name: "Lay's Classic Chips 200g", category: 'Snacks', defaultQuantity: 1, basePrice: 80, isCore: true },
      { name: 'Coca-Cola 2L', category: 'Beverages', defaultQuantity: 1, basePrice: 95, isCore: true, scalingFactor: 0.5 },
      { name: 'Cadbury Dairy Milk Silk 150g', category: 'Snacks', defaultQuantity: 1, basePrice: 180, isCore: true },
      { name: 'Kurkure Masala Munch 150g', category: 'Snacks', defaultQuantity: 1, basePrice: 50, isCore: false },
      { name: 'Ice Cream (Amul Tub) 500ml', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 200, isCore: false },
      { name: 'Pringles Original 134g', category: 'Snacks', defaultQuantity: 1, basePrice: 199, isCore: false },
    ],
    optionalAddons: [
      { name: 'Nachos with Cheese Dip', category: 'Snacks', defaultQuantity: 1, basePrice: 150, isCore: false },
      { name: 'Oreo Biscuits 300g', category: 'Snacks', defaultQuantity: 1, basePrice: 70, isCore: false },
    ],
  },
  {
    id: 'guest_hosting',
    name: 'Guests Arriving',
    intentCategory: 'event',
    keywords: ['guests', 'guests arriving', 'hosting', 'visitors', 'friends coming', 'dinner party', 'house party'],
    items: [
      { name: 'Haldiram Namkeen Mix 400g', category: 'Snacks', defaultQuantity: 2, basePrice: 150, isCore: true, scalingFactor: 0.5 },
      { name: 'Soft Drinks (Assorted) 2L x2', category: 'Beverages', defaultQuantity: 1, basePrice: 190, isCore: true, scalingFactor: 0.5 },
      { name: 'Paper Cups Pack of 50', category: 'Supplies', defaultQuantity: 1, basePrice: 90, isCore: true },
      { name: 'Paper Plates Pack of 25', category: 'Supplies', defaultQuantity: 1, basePrice: 80, isCore: true },
      { name: 'Paper Napkins Pack of 50', category: 'Supplies', defaultQuantity: 1, basePrice: 60, isCore: true },
      { name: 'Chips & Snacks Combo', category: 'Snacks', defaultQuantity: 1, basePrice: 200, isCore: true },
      { name: 'Sweets Box (Assorted) 500g', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 300, isCore: false, scalingFactor: 0.5 },
      { name: 'Bisleri Water 5L', category: 'Beverages', defaultQuantity: 1, basePrice: 60, isCore: true },
    ],
    optionalAddons: [
      { name: 'Ice Cubes 1kg', category: 'Beverages', defaultQuantity: 1, basePrice: 40, isCore: false },
      { name: 'Room Freshener', category: 'Household', defaultQuantity: 1, basePrice: 140, isCore: false },
      { name: 'Fairy Lights 5m', category: 'Entertainment', defaultQuantity: 1, basePrice: 250, isCore: false },
    ],
  },
  {
    id: 'birthday_party',
    name: 'Birthday Party',
    intentCategory: 'event',
    keywords: ['birthday', 'birthday party', 'bday', 'birthday celebration'],
    items: [
      { name: 'Birthday Cake (Fresh) 1kg', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 600, isCore: true },
      { name: 'Party Balloons Pack of 25', category: 'Entertainment', defaultQuantity: 1, basePrice: 100, isCore: true },
      { name: 'Birthday Candles Pack', category: 'Entertainment', defaultQuantity: 1, basePrice: 50, isCore: true },
      { name: 'Paper Plates Pack of 25', category: 'Supplies', defaultQuantity: 1, basePrice: 80, isCore: true },
      { name: 'Paper Cups Pack of 50', category: 'Supplies', defaultQuantity: 1, basePrice: 90, isCore: true },
      { name: 'Soft Drinks (Assorted) 2L x2', category: 'Beverages', defaultQuantity: 1, basePrice: 190, isCore: true },
      { name: 'Chips Party Pack', category: 'Snacks', defaultQuantity: 2, basePrice: 100, isCore: true },
      { name: 'Cadbury Celebrations Box', category: 'Snacks', defaultQuantity: 1, basePrice: 350, isCore: false },
    ],
    optionalAddons: [
      { name: 'Party Poppers Pack of 10', category: 'Entertainment', defaultQuantity: 1, basePrice: 80, isCore: false },
      { name: 'Gift Wrapping Paper', category: 'Supplies', defaultQuantity: 1, basePrice: 50, isCore: false },
      { name: 'Streamers & Decorations', category: 'Entertainment', defaultQuantity: 1, basePrice: 150, isCore: false },
    ],
  },

  // SNACK TEMPLATES
  {
    id: 'weekend_snacks',
    name: 'Weekend Snacks',
    intentCategory: 'snack',
    keywords: ['weekend snacks', 'snacking', 'munchies', 'cravings', 'snack time'],
    items: [
      { name: "Lay's Classic Chips 200g", category: 'Snacks', defaultQuantity: 1, basePrice: 80, isCore: true },
      { name: 'Kurkure Masala Munch 150g', category: 'Snacks', defaultQuantity: 1, basePrice: 50, isCore: true },
      { name: 'Oreo Biscuits 300g', category: 'Snacks', defaultQuantity: 1, basePrice: 70, isCore: true },
      { name: 'Coca-Cola 1.5L', category: 'Beverages', defaultQuantity: 1, basePrice: 80, isCore: true },
      { name: 'Cadbury Dairy Milk 100g', category: 'Snacks', defaultQuantity: 1, basePrice: 100, isCore: false },
      { name: 'Haldiram Bhujia 400g', category: 'Snacks', defaultQuantity: 1, basePrice: 120, isCore: false },
    ],
    optionalAddons: [
      { name: 'Ice Cream Tub 500ml', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 200, isCore: false },
      { name: 'Pringles Sour Cream 134g', category: 'Snacks', defaultQuantity: 1, basePrice: 199, isCore: false },
    ],
  },
  {
    id: 'study_session',
    name: 'Study Session',
    intentCategory: 'snack',
    keywords: ['study', 'studying', 'exam prep', 'late night study', 'working late', 'all nighter'],
    items: [
      { name: 'Nescafe Classic 100g', category: 'Beverages', defaultQuantity: 1, basePrice: 280, isCore: true },
      { name: 'Amul Milk 500ml', category: 'Food & Drinks', defaultQuantity: 2, basePrice: 30, isCore: true },
      { name: 'Maggi Noodles (Pack of 4)', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 56, isCore: true },
      { name: 'Hide & Seek Biscuits', category: 'Snacks', defaultQuantity: 1, basePrice: 40, isCore: true },
      { name: 'Red Bull Energy Drink 250ml', category: 'Beverages', defaultQuantity: 2, basePrice: 125, isCore: false },
      { name: 'Mixed Nuts 200g', category: 'Snacks', defaultQuantity: 1, basePrice: 180, isCore: false },
    ],
    optionalAddons: [
      { name: 'Dark Chocolate 70% 100g', category: 'Snacks', defaultQuantity: 1, basePrice: 150, isCore: false },
    ],
  },

  // EMERGENCY TEMPLATES
  {
    id: 'power_outage',
    name: 'Power Outage',
    intentCategory: 'emergency',
    keywords: ['power cut', 'power outage', 'blackout', 'no electricity', 'load shedding'],
    items: [
      { name: 'Candles Pack of 10', category: 'Household', defaultQuantity: 1, basePrice: 60, isCore: true },
      { name: 'Matchbox Pack of 10', category: 'Household', defaultQuantity: 1, basePrice: 20, isCore: true },
      { name: 'LED Torch', category: 'Household', defaultQuantity: 1, basePrice: 200, isCore: true },
      { name: 'AA Batteries Pack of 4', category: 'Household', defaultQuantity: 1, basePrice: 120, isCore: true },
      { name: 'Bisleri Water 5L', category: 'Beverages', defaultQuantity: 2, basePrice: 60, isCore: true },
      { name: 'Ready to Eat Meals', category: 'Food & Drinks', defaultQuantity: 2, basePrice: 100, isCore: false },
    ],
    optionalAddons: [
      { name: 'Power Bank 10000mAh', category: 'Household', defaultQuantity: 1, basePrice: 800, isCore: false },
      { name: 'Mosquito Repellent Coil', category: 'Household', defaultQuantity: 1, basePrice: 50, isCore: false },
    ],
  },

  // RESTOCKING TEMPLATES
  {
    id: 'weekly_groceries',
    name: 'Weekly Groceries',
    intentCategory: 'restocking',
    keywords: ['weekly groceries', 'grocery', 'restocking', 'monthly essentials', 'kitchen essentials'],
    items: [
      { name: 'Amul Milk 500ml', category: 'Food & Drinks', defaultQuantity: 4, basePrice: 30, isCore: true },
      { name: 'Bread (White/Brown)', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 45, isCore: true },
      { name: 'Eggs (6 Pack)', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 50, isCore: true },
      { name: 'Onions 1kg', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 40, isCore: true },
      { name: 'Tomatoes 1kg', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 50, isCore: true },
      { name: 'Atta Whole Wheat 5kg', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 320, isCore: true },
      { name: 'Rice 5kg', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 350, isCore: true },
      { name: 'Cooking Oil 1L', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 160, isCore: true },
      { name: 'Sugar 1kg', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 50, isCore: true },
      { name: 'Tata Tea Premium 500g', category: 'Beverages', defaultQuantity: 1, basePrice: 240, isCore: false },
    ],
    optionalAddons: [
      { name: 'Fruits (Seasonal) 1kg', category: 'Food & Drinks', defaultQuantity: 1, basePrice: 100, isCore: false },
      { name: 'Dettol Hand Wash 200ml', category: 'Personal Care', defaultQuantity: 1, basePrice: 70, isCore: false },
    ],
  },
];
