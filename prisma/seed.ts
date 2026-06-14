import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

async function main() {
  const connectionString = process.env.DATABASE_URL ?? "";
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  // Clear existing products
  await prisma.product.deleteMany();

  const products = [
    // Food & Drinks
    { name: "Amul Butter 500g", description: "Fresh pasteurized butter", category: "Food & Drinks", price: 280 },
    { name: "Basmati Rice 5kg", description: "Premium aged basmati rice", category: "Food & Drinks", price: 650 },
    { name: "Paneer 200g", description: "Fresh cottage cheese block", category: "Food & Drinks", price: 90 },
    { name: "Chicken Breast 500g", description: "Fresh boneless chicken breast", category: "Food & Drinks", price: 250 },
    { name: "Onions 1kg", description: "Fresh red onions", category: "Food & Drinks", price: 40 },
    { name: "Tomatoes 1kg", description: "Fresh ripe tomatoes", category: "Food & Drinks", price: 50 },
    { name: "MDH Biryani Masala 50g", description: "Biryani spice mix", category: "Food & Drinks", price: 75 },
    { name: "Atta Whole Wheat 5kg", description: "Whole wheat flour for chapati", category: "Food & Drinks", price: 320 },

    // Snacks
    { name: "Lay's Classic Chips 200g", description: "Salted potato chips party pack", category: "Snacks", price: 80 },
    { name: "Kurkure Masala Munch 150g", description: "Crunchy corn puffs", category: "Snacks", price: 50 },
    { name: "Haldiram Namkeen Mix 400g", description: "Assorted Indian snack mix", category: "Snacks", price: 150 },
    { name: "Oreo Biscuits 300g", description: "Chocolate cream sandwich cookies", category: "Snacks", price: 70 },
    { name: "ACT II Popcorn Pack of 3", description: "Microwave butter popcorn", category: "Snacks", price: 120 },
    { name: "Cadbury Dairy Milk Silk 150g", description: "Smooth chocolate bar", category: "Snacks", price: 180 },
    { name: "Pringles Original 134g", description: "Stacked potato crisps", category: "Snacks", price: 199 },

    // Beverages
    { name: "Coca-Cola 2L", description: "Carbonated soft drink", category: "Beverages", price: 95 },
    { name: "Tropicana Orange Juice 1L", description: "100% orange juice", category: "Beverages", price: 110 },
    { name: "Bisleri Water 5L", description: "Packaged drinking water", category: "Beverages", price: 60 },
    { name: "Red Bull Energy Drink 250ml", description: "Energy drink can", category: "Beverages", price: 125 },
    { name: "Paper Boat Aam Panna 200ml x6", description: "Traditional mango drink pack", category: "Beverages", price: 180 },
    { name: "Tata Tea Premium 500g", description: "Premium leaf tea", category: "Beverages", price: 240 },
    { name: "Nescafe Classic 100g", description: "Instant coffee powder", category: "Beverages", price: 280 },
    { name: "Kingfisher Soda 750ml x4", description: "Soda water combo pack", category: "Beverages", price: 120 },

    // Supplies
    { name: "Paper Plates Pack of 50", description: "Disposable white paper plates", category: "Supplies", price: 150 },
    { name: "Paper Cups Pack of 50", description: "Disposable cups 200ml", category: "Supplies", price: 90 },
    { name: "Paper Napkins Pack of 100", description: "White tissue napkins", category: "Supplies", price: 80 },
    { name: "Garbage Bags Pack of 30", description: "Large black garbage bags", category: "Supplies", price: 120 },
    { name: "Aluminium Foil 9m", description: "Kitchen aluminium foil roll", category: "Supplies", price: 90 },
    { name: "Cling Wrap 30m", description: "Food-grade cling film", category: "Supplies", price: 110 },

    // Entertainment
    { name: "Playing Cards Deck", description: "Standard 52-card deck", category: "Entertainment", price: 80 },
    { name: "UNO Card Game", description: "Classic UNO card game", category: "Entertainment", price: 199 },
    { name: "Birthday Candles Pack", description: "Colorful birthday candles set of 12", category: "Entertainment", price: 50 },
    { name: "Party Balloons Pack of 25", description: "Assorted color latex balloons", category: "Entertainment", price: 100 },
    { name: "Sparklers Pack of 10", description: "Indoor/outdoor sparkler sticks", category: "Entertainment", price: 60 },
    { name: "Fairy Lights 5m", description: "Warm white LED string lights", category: "Entertainment", price: 250 },
    { name: "Bluetooth Speaker Rental", description: "Portable wireless speaker for parties", category: "Entertainment", price: 499 },

    // Household
    { name: "Vim Dishwash Liquid 500ml", description: "Dishwashing liquid gel", category: "Household", price: 110 },
    { name: "Harpic Toilet Cleaner 500ml", description: "Disinfectant toilet cleaner", category: "Household", price: 95 },
    { name: "Hit Mosquito Spray 200ml", description: "Flying insect killer spray", category: "Household", price: 160 },
    { name: "Scotch-Brite Scrub Pad 3pk", description: "Kitchen cleaning scrub pads", category: "Household", price: 60 },
    { name: "Room Freshener Lavender 240ml", description: "Air freshener spray", category: "Household", price: 140 },
    { name: "Lizol Floor Cleaner 1L", description: "Disinfectant surface cleaner", category: "Household", price: 175 },

    // Personal Care
    { name: "Dettol Hand Wash 200ml", description: "Antibacterial liquid hand wash", category: "Personal Care", price: 70 },
    { name: "Nivea Body Lotion 200ml", description: "Moisturizing body lotion", category: "Personal Care", price: 200 },
    { name: "Colgate MaxFresh 150g", description: "Cooling crystal toothpaste", category: "Personal Care", price: 110 },
    { name: "Head & Shoulders 340ml", description: "Anti-dandruff shampoo", category: "Personal Care", price: 350 },
    { name: "Gillette Guard Razor", description: "Single blade safety razor", category: "Personal Care", price: 45 },
    { name: "Vaseline Petroleum Jelly 100g", description: "Multi-purpose skin protectant", category: "Personal Care", price: 85 },
  ];

  await prisma.product.createMany({
    data: products.map((p) => ({
      ...p,
      inStock: true,
    })),
  });

  console.log(`Seeded ${products.length} products across ${new Set(products.map((p) => p.category)).size} categories`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
