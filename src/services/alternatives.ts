export interface ProductAlternative {
  name: string;
  price: number;
  type: 'brand' | 'size' | 'variant';
}

export const PRODUCT_ALTERNATIVES: Record<string, ProductAlternative[]> = {
  'maggi': [
    { name: 'Maggi Family Pack (8pc)', price: 96, type: 'size' },
    { name: 'Yippee Noodles (Pack of 4)', price: 52, type: 'brand' },
    { name: 'Top Ramen Curry (Pack of 4)', price: 48, type: 'brand' },
    { name: "Ching's Desi Chinese (Pack of 4)", price: 60, type: 'brand' },
  ],
  'chicken': [
    { name: 'Chicken Drumsticks 500g', price: 180, type: 'variant' },
    { name: 'Chicken Thighs 500g', price: 220, type: 'variant' },
    { name: 'Chicken Whole 1kg', price: 350, type: 'size' },
  ],
  'biryani masala': [
    { name: 'Everest Biryani Masala 50g', price: 65, type: 'brand' },
    { name: 'Shan Biryani Masala 60g', price: 90, type: 'brand' },
    { name: 'Catch Biryani Masala 100g', price: 110, type: 'brand' },
  ],
  'basmati rice': [
    { name: 'India Gate Basmati 1kg', price: 220, type: 'brand' },
    { name: 'Daawat Basmati 1kg', price: 200, type: 'brand' },
    { name: 'Fortune Basmati 5kg', price: 650, type: 'size' },
  ],
  'coca-cola': [
    { name: 'Coca-Cola 750ml', price: 40, type: 'size' },
    { name: 'Pepsi 2L', price: 90, type: 'brand' },
    { name: 'Thumbs Up 2L', price: 90, type: 'brand' },
    { name: 'Sprite 2L', price: 90, type: 'brand' },
  ],
  'chips': [
    { name: "Lay's Magic Masala 200g", price: 80, type: 'variant' },
    { name: 'Pringles Original 134g', price: 199, type: 'brand' },
    { name: 'Bingo Mad Angles 200g', price: 60, type: 'brand' },
  ],
  'popcorn': [
    { name: 'ACT II Classic Salt (Pack of 3)', price: 110, type: 'variant' },
    { name: 'ACT II Cheese Popcorn', price: 50, type: 'variant' },
  ],
  'coffee': [
    { name: 'Nescafe Classic 200g', price: 480, type: 'size' },
    { name: 'Nescafe Gold 50g', price: 350, type: 'variant' },
    { name: 'Bru Instant Coffee 100g', price: 230, type: 'brand' },
  ],
  'milk': [
    { name: 'Amul Milk 1L', price: 58, type: 'size' },
    { name: 'Mother Dairy Milk 500ml', price: 28, type: 'brand' },
    { name: 'Amul Gold 500ml', price: 34, type: 'variant' },
  ],
  'oil': [
    { name: 'Fortune Sunflower Oil 1L', price: 140, type: 'brand' },
    { name: 'Saffola Gold 1L', price: 200, type: 'brand' },
    { name: 'Dhara Mustard Oil 1L', price: 160, type: 'brand' },
  ],
  'tea': [
    { name: 'Red Label Tea 250g', price: 120, type: 'brand' },
    { name: 'Taj Mahal Tea 250g', price: 180, type: 'brand' },
    { name: 'Wagh Bakri Tea 250g', price: 130, type: 'brand' },
  ],
};

export function getAlternatives(productName: string): ProductAlternative[] {
  const nameLower = productName.toLowerCase();
  for (const [key, alternatives] of Object.entries(PRODUCT_ALTERNATIVES)) {
    if (nameLower.includes(key)) {
      return alternatives;
    }
  }
  return [];
}
