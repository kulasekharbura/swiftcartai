export interface ProductAlternative {
  name: string;
  price: number;
  type: 'brand' | 'size' | 'variant';
}

export const PRODUCT_ALTERNATIVES: Record<string, ProductAlternative[]> = {
  // NOODLES / INSTANT FOOD
  'maggi': [
    { name: 'Maggi Family Pack (8pc)', price: 96, type: 'size' },
    { name: 'Yippee Noodles (Pack of 4)', price: 52, type: 'brand' },
    { name: 'Top Ramen Curry (Pack of 4)', price: 48, type: 'brand' },
    { name: "Ching's Desi Chinese (Pack of 4)", price: 60, type: 'brand' },
  ],

  // MEAT
  'chicken': [
    { name: 'Chicken Drumsticks 500g', price: 180, type: 'variant' },
    { name: 'Chicken Thighs 500g', price: 220, type: 'variant' },
    { name: 'Chicken Whole 1kg', price: 350, type: 'size' },
    { name: 'Chicken Breast Boneless 500g', price: 280, type: 'variant' },
  ],

  // MASALAS
  'biryani masala': [
    { name: 'Everest Biryani Masala 50g', price: 65, type: 'brand' },
    { name: 'Shan Biryani Masala 60g', price: 90, type: 'brand' },
    { name: 'Catch Biryani Masala 100g', price: 110, type: 'brand' },
    { name: 'Priya Biryani Masala 50g', price: 55, type: 'brand' },
  ],

  // RICE
  'basmati rice': [
    { name: 'India Gate Basmati 1kg', price: 220, type: 'brand' },
    { name: 'Daawat Basmati 1kg', price: 200, type: 'brand' },
    { name: 'Fortune Basmati 5kg', price: 650, type: 'size' },
    { name: 'Kohinoor Basmati 1kg', price: 250, type: 'brand' },
  ],
  'rice 5kg': [
    { name: 'India Gate Basmati 5kg', price: 700, type: 'brand' },
    { name: 'Daawat Rozana 5kg', price: 400, type: 'brand' },
    { name: 'Fortune Everyday Rice 5kg', price: 350, type: 'brand' },
  ],

  // SOFT DRINKS
  'coca-cola': [
    { name: 'Coca-Cola 750ml', price: 40, type: 'size' },
    { name: 'Pepsi 2L', price: 90, type: 'brand' },
    { name: 'Thumbs Up 2L', price: 90, type: 'brand' },
    { name: 'Sprite 2L', price: 90, type: 'brand' },
    { name: 'Coca-Cola Zero 2L', price: 99, type: 'variant' },
  ],
  'soft drink': [
    { name: 'Coca-Cola 2L', price: 95, type: 'brand' },
    { name: 'Pepsi 2L', price: 90, type: 'brand' },
    { name: 'Sprite 2L', price: 90, type: 'brand' },
    { name: 'Fanta 2L', price: 90, type: 'brand' },
    { name: 'Thumbs Up 2L', price: 90, type: 'brand' },
  ],

  // CHIPS
  'chips': [
    { name: "Lay's Magic Masala 200g", price: 80, type: 'variant' },
    { name: 'Pringles Original 134g', price: 199, type: 'brand' },
    { name: 'Bingo Mad Angles 200g', price: 60, type: 'brand' },
    { name: "Uncle Chips 200g", price: 70, type: 'brand' },
    { name: 'Kurkure Masala Munch 150g', price: 50, type: 'brand' },
  ],

  // KURKURE / NAMKEEN SNACKS
  'kurkure': [
    { name: "Lay's Classic Chips 200g", price: 80, type: 'brand' },
    { name: 'Bingo Tedhe Medhe 150g', price: 40, type: 'brand' },
    { name: 'Haldiram Aloo Bhujia 200g', price: 70, type: 'brand' },
    { name: 'Cornitos Nachos 150g', price: 99, type: 'brand' },
    { name: 'Bingo Mad Angles 200g', price: 60, type: 'brand' },
  ],

  // NACHOS
  'nachos': [
    { name: 'Cornitos Nachos 150g', price: 99, type: 'brand' },
    { name: 'Doritos Nachos 150g', price: 120, type: 'brand' },
    { name: 'Bingo Nachos 100g', price: 50, type: 'brand' },
    { name: 'Kurkure Masala Munch 150g', price: 50, type: 'brand' },
    { name: "Lay's Classic Chips 200g", price: 80, type: 'brand' },
  ],

  // NAMKEEN MIX
  'namkeen': [
    { name: 'Haldiram Namkeen Mix 400g', price: 150, type: 'size' },
    { name: 'Haldiram Bhujia 400g', price: 120, type: 'variant' },
    { name: 'Bikaji Bhujia 400g', price: 130, type: 'brand' },
    { name: 'Haldiram Moong Dal 200g', price: 70, type: 'variant' },
  ],
  'haldiram': [
    { name: 'Haldiram Bhujia 400g', price: 120, type: 'variant' },
    { name: 'Bikaji Bhujia 400g', price: 130, type: 'brand' },
    { name: 'Haldiram Namkeen Aloo Bhujia 200g', price: 70, type: 'variant' },
    { name: 'Balaji Namkeen Mix 400g', price: 110, type: 'brand' },
  ],

  // POPCORN
  'popcorn': [
    { name: 'ACT II Classic Salt (Pack of 3)', price: 110, type: 'variant' },
    { name: 'ACT II Cheese Popcorn', price: 50, type: 'variant' },
    { name: 'ACT II Butter Delite (Single)', price: 45, type: 'size' },
    { name: 'Cornitos Popcorn 90g', price: 60, type: 'brand' },
  ],

  // CHOCOLATE
  'chocolate': [
    { name: 'Cadbury Dairy Milk Silk 150g', price: 180, type: 'variant' },
    { name: 'Cadbury Dairy Milk 100g', price: 100, type: 'size' },
    { name: 'KitKat 4-Finger 46g', price: 40, type: 'brand' },
    { name: 'Amul Dark Chocolate 150g', price: 150, type: 'brand' },
    { name: '5 Star 3D 42g', price: 30, type: 'brand' },
  ],
  'cadbury': [
    { name: 'Cadbury Dairy Milk Silk 150g', price: 180, type: 'variant' },
    { name: 'Cadbury Dairy Milk 50g', price: 50, type: 'size' },
    { name: 'Cadbury Celebrations Box', price: 350, type: 'size' },
    { name: 'Amul Dark Chocolate 150g', price: 150, type: 'brand' },
    { name: 'Ferrero Rocher 3pc', price: 160, type: 'brand' },
  ],

  // BISCUITS
  'biscuit': [
    { name: 'Parle-G Gold 200g', price: 30, type: 'variant' },
    { name: 'Oreo Biscuits 300g', price: 70, type: 'brand' },
    { name: 'Bourbon 150g', price: 35, type: 'brand' },
    { name: 'Hide & Seek 200g', price: 55, type: 'brand' },
    { name: 'Marie Gold 250g', price: 40, type: 'brand' },
  ],
  'oreo': [
    { name: 'Bourbon 150g', price: 35, type: 'brand' },
    { name: 'Hide & Seek 200g', price: 55, type: 'brand' },
    { name: 'Parle-G Gold 200g', price: 30, type: 'brand' },
    { name: 'Dark Fantasy 150g', price: 60, type: 'brand' },
  ],
  'parle': [
    { name: 'Oreo Biscuits 120g', price: 30, type: 'brand' },
    { name: 'Marie Gold 250g', price: 40, type: 'brand' },
    { name: 'Bourbon 150g', price: 35, type: 'brand' },
    { name: 'Good Day Butter 100g', price: 30, type: 'brand' },
  ],
  'hide & seek': [
    { name: 'Oreo Biscuits 120g', price: 30, type: 'brand' },
    { name: 'Dark Fantasy 150g', price: 60, type: 'brand' },
    { name: 'Bourbon 150g', price: 35, type: 'brand' },
    { name: 'Parle-G Gold 200g', price: 30, type: 'brand' },
  ],

  // COFFEE
  'coffee': [
    { name: 'Nescafe Classic 200g', price: 480, type: 'size' },
    { name: 'Nescafe Gold 50g', price: 350, type: 'variant' },
    { name: 'Bru Instant Coffee 100g', price: 230, type: 'brand' },
    { name: 'Continental Coffee 50g', price: 160, type: 'brand' },
  ],
  'nescafe': [
    { name: 'Nescafe Classic 200g', price: 480, type: 'size' },
    { name: 'Nescafe Gold 50g', price: 350, type: 'variant' },
    { name: 'Bru Instant Coffee 100g', price: 230, type: 'brand' },
    { name: 'Continental Coffee 50g', price: 160, type: 'brand' },
  ],

  // TEA
  'tea': [
    { name: 'Red Label Tea 250g', price: 120, type: 'brand' },
    { name: 'Taj Mahal Tea 250g', price: 180, type: 'brand' },
    { name: 'Wagh Bakri Tea 250g', price: 130, type: 'brand' },
    { name: 'Tata Tea Gold 250g', price: 160, type: 'variant' },
  ],

  // MILK
  'milk': [
    { name: 'Amul Milk 1L', price: 58, type: 'size' },
    { name: 'Mother Dairy Milk 500ml', price: 28, type: 'brand' },
    { name: 'Amul Gold 500ml', price: 34, type: 'variant' },
    { name: 'Amul Taaza 500ml', price: 25, type: 'variant' },
  ],

  // COOKING OIL
  'oil': [
    { name: 'Fortune Sunflower Oil 1L', price: 140, type: 'brand' },
    { name: 'Saffola Gold 1L', price: 200, type: 'brand' },
    { name: 'Dhara Mustard Oil 1L', price: 160, type: 'brand' },
    { name: 'Cooking Oil 5L (Bulk)', price: 700, type: 'size' },
  ],

  // BREAD
  'bread': [
    { name: 'Britannia Bread White', price: 40, type: 'brand' },
    { name: 'Britannia Brown Bread', price: 50, type: 'variant' },
    { name: 'Modern Bread White', price: 38, type: 'brand' },
    { name: 'Harvest Gold Multigrain', price: 60, type: 'variant' },
  ],

  // EGGS
  'eggs': [
    { name: 'Eggs (6 Pack)', price: 50, type: 'size' },
    { name: 'Eggs (12 Pack)', price: 95, type: 'size' },
    { name: 'Eggs (30 Tray)', price: 220, type: 'size' },
    { name: 'Organic Eggs (6 Pack)', price: 80, type: 'variant' },
  ],

  // ATTA / FLOUR
  'atta': [
    { name: 'Aashirvaad Atta 5kg', price: 310, type: 'brand' },
    { name: 'Pillsbury Atta 5kg', price: 290, type: 'brand' },
    { name: 'Fortune Chakki Atta 5kg', price: 280, type: 'brand' },
    { name: 'Aashirvaad Multigrain 5kg', price: 350, type: 'variant' },
  ],

  // SUGAR
  'sugar': [
    { name: 'Sugar 2kg', price: 90, type: 'size' },
    { name: 'Sugar 5kg', price: 220, type: 'size' },
    { name: 'Organic Sugar 1kg', price: 80, type: 'variant' },
    { name: 'Brown Sugar 500g', price: 60, type: 'variant' },
  ],

  // CURD / YOGURT
  'curd': [
    { name: 'Amul Masti Curd 400g', price: 40, type: 'brand' },
    { name: 'Mother Dairy Curd 400g', price: 38, type: 'brand' },
    { name: 'Nestle Greek Yogurt 100g', price: 45, type: 'variant' },
    { name: 'Amul Curd 200g', price: 25, type: 'size' },
  ],

  // ONION / VEGETABLES
  'onion': [
    { name: 'Onions 2kg', price: 75, type: 'size' },
    { name: 'Onions 500g', price: 25, type: 'size' },
    { name: 'Shallots 500g', price: 50, type: 'variant' },
  ],
  'tomato': [
    { name: 'Tomatoes 2kg', price: 90, type: 'size' },
    { name: 'Cherry Tomatoes 200g', price: 60, type: 'variant' },
    { name: 'Tomato Puree 400g', price: 50, type: 'variant' },
  ],

  // GHEE
  'ghee': [
    { name: 'Amul Ghee 500g', price: 310, type: 'size' },
    { name: 'Patanjali Ghee 200g', price: 110, type: 'brand' },
    { name: 'Mother Dairy Ghee 200g', price: 115, type: 'brand' },
    { name: 'Amul Ghee 1L', price: 580, type: 'size' },
  ],

  // PANEER
  'paneer': [
    { name: 'Amul Paneer 200g', price: 90, type: 'brand' },
    { name: 'Mother Dairy Paneer 200g', price: 85, type: 'brand' },
    { name: 'Amul Paneer 400g', price: 170, type: 'size' },
    { name: 'Tofu 200g (Vegan)', price: 70, type: 'variant' },
  ],

  // PASTA / SAUCE
  'pasta': [
    { name: 'Barilla Penne 500g', price: 150, type: 'brand' },
    { name: 'Del Monte Pasta 500g', price: 80, type: 'brand' },
    { name: 'Weikfield Penne 500g', price: 75, type: 'brand' },
    { name: 'Whole Wheat Pasta 500g', price: 110, type: 'variant' },
  ],
  'pasta sauce': [
    { name: 'Del Monte Pasta Sauce 400g', price: 130, type: 'brand' },
    { name: 'Kissan Pizza & Pasta Sauce 350g', price: 100, type: 'brand' },
    { name: 'Funfoods Pasta Sauce 325g', price: 110, type: 'brand' },
    { name: 'Homemade Marinara (Tomato + Garlic)', price: 70, type: 'variant' },
  ],

  // CHEESE
  'cheese': [
    { name: 'Amul Cheese Slices (10pc)', price: 130, type: 'variant' },
    { name: 'Britannia Cheese Block 200g', price: 110, type: 'brand' },
    { name: 'Amul Mozzarella 200g', price: 180, type: 'variant' },
    { name: 'Go Cheese Spread 200g', price: 90, type: 'variant' },
  ],

  // ICE CREAM
  'ice cream': [
    { name: 'Amul Ice Cream Tub 500ml', price: 200, type: 'brand' },
    { name: 'Kwality Walls 500ml', price: 220, type: 'brand' },
    { name: 'Baskin Robbins Pint', price: 350, type: 'brand' },
    { name: 'Naturals Ice Cream 500ml', price: 250, type: 'brand' },
    { name: 'Cornetto Cone (2 Pack)', price: 80, type: 'variant' },
  ],

  // ENERGY DRINKS
  'energy drink': [
    { name: 'Red Bull 250ml', price: 125, type: 'brand' },
    { name: 'Monster Energy 350ml', price: 150, type: 'brand' },
    { name: 'Sting Energy 250ml', price: 20, type: 'brand' },
    { name: 'Gatorade 500ml', price: 50, type: 'brand' },
  ],
  'red bull': [
    { name: 'Monster Energy 350ml', price: 150, type: 'brand' },
    { name: 'Sting Energy 250ml', price: 20, type: 'brand' },
    { name: 'Red Bull Sugar Free 250ml', price: 125, type: 'variant' },
    { name: 'Gatorade 500ml', price: 50, type: 'brand' },
  ],

  // WATER
  'water': [
    { name: 'Bisleri 1L', price: 20, type: 'size' },
    { name: 'Bisleri 2L', price: 35, type: 'size' },
    { name: 'Kinley 5L', price: 55, type: 'brand' },
    { name: 'Himalayan 1L', price: 30, type: 'brand' },
  ],
  'bisleri': [
    { name: 'Kinley Water 5L', price: 55, type: 'brand' },
    { name: 'Bisleri 2L', price: 35, type: 'size' },
    { name: 'Bisleri 1L (Pack of 6)', price: 100, type: 'size' },
    { name: 'Himalayan 5L', price: 65, type: 'brand' },
  ],

  // JUICE
  'juice': [
    { name: 'Tropicana Orange 1L', price: 110, type: 'brand' },
    { name: 'Real Fruit Juice 1L', price: 100, type: 'brand' },
    { name: 'Paper Boat Aamras 200ml x6', price: 180, type: 'brand' },
    { name: 'Raw Pressery 250ml', price: 120, type: 'brand' },
  ],

  // PRINGLES
  'pringles': [
    { name: "Lay's Classic Chips 200g", price: 80, type: 'brand' },
    { name: 'Pringles Sour Cream 134g', price: 199, type: 'variant' },
    { name: 'Pringles Hot & Spicy 134g', price: 199, type: 'variant' },
    { name: 'Bingo Stix 100g', price: 40, type: 'brand' },
  ],

  // PAPER PLATES / CUPS / SUPPLIES
  'paper plate': [
    { name: 'Paper Plates Pack of 25', price: 80, type: 'size' },
    { name: 'Paper Plates Pack of 100', price: 250, type: 'size' },
    { name: 'Areca Leaf Plates (Eco) 25pc', price: 150, type: 'variant' },
  ],
  'paper cup': [
    { name: 'Paper Cups 100pc', price: 160, type: 'size' },
    { name: 'Paper Cups 25pc', price: 50, type: 'size' },
    { name: 'Eco Cups (Compostable) 50pc', price: 130, type: 'variant' },
  ],
  'napkin': [
    { name: 'Paper Napkins 200pc', price: 120, type: 'size' },
    { name: 'Paper Napkins 50pc', price: 40, type: 'size' },
    { name: 'Wet Wipes 30pc', price: 80, type: 'variant' },
  ],

  // BALLOONS / PARTY
  'balloon': [
    { name: 'Balloons Pack of 50', price: 180, type: 'size' },
    { name: 'Metallic Balloons 25pc', price: 150, type: 'variant' },
    { name: 'LED Balloons 10pc', price: 200, type: 'variant' },
  ],

  // CANDLES
  'candle': [
    { name: 'Candles Pack of 20', price: 100, type: 'size' },
    { name: 'Scented Candles 3pc', price: 250, type: 'variant' },
    { name: 'LED Candles (Battery) 3pc', price: 200, type: 'variant' },
  ],

  // BATTERIES
  'batteries': [
    { name: 'Duracell AA 4-Pack', price: 150, type: 'brand' },
    { name: 'Eveready AA 4-Pack', price: 100, type: 'brand' },
    { name: 'Duracell AAA 4-Pack', price: 140, type: 'variant' },
    { name: 'Energizer AA 4-Pack', price: 160, type: 'brand' },
  ],

  // HAND WASH / SOAP
  'hand wash': [
    { name: 'Lifebuoy Hand Wash 200ml', price: 65, type: 'brand' },
    { name: 'Dettol Hand Wash 200ml', price: 70, type: 'brand' },
    { name: 'Himalaya Hand Wash 200ml', price: 75, type: 'brand' },
    { name: 'Dettol Hand Wash 500ml (Refill)', price: 120, type: 'size' },
  ],
  'dettol': [
    { name: 'Lifebuoy Hand Wash 200ml', price: 65, type: 'brand' },
    { name: 'Himalaya Hand Wash 200ml', price: 75, type: 'brand' },
    { name: 'Dettol Soap 75g (Pack of 3)', price: 100, type: 'variant' },
    { name: 'Savlon Hand Wash 200ml', price: 60, type: 'brand' },
  ],

  // TOOTHPASTE
  'toothpaste': [
    { name: 'Colgate MaxFresh 150g', price: 110, type: 'brand' },
    { name: 'Pepsodent 150g', price: 80, type: 'brand' },
    { name: 'Sensodyne 80g', price: 180, type: 'brand' },
    { name: 'Closeup 150g', price: 95, type: 'brand' },
    { name: 'Patanjali Dant Kanti 100g', price: 55, type: 'brand' },
  ],
  'colgate': [
    { name: 'Pepsodent 150g', price: 80, type: 'brand' },
    { name: 'Sensodyne 80g', price: 180, type: 'brand' },
    { name: 'Closeup 150g', price: 95, type: 'brand' },
    { name: 'Colgate Total 120g', price: 130, type: 'variant' },
  ],

  // SHAMPOO
  'shampoo': [
    { name: 'Head & Shoulders 340ml', price: 350, type: 'brand' },
    { name: 'Dove Shampoo 340ml', price: 300, type: 'brand' },
    { name: 'Pantene 340ml', price: 280, type: 'brand' },
    { name: 'Clinic Plus 340ml', price: 200, type: 'brand' },
  ],

  // BODY LOTION
  'lotion': [
    { name: 'Nivea Body Lotion 200ml', price: 200, type: 'brand' },
    { name: 'Vaseline Lotion 200ml', price: 180, type: 'brand' },
    { name: 'Cetaphil Moisturizer 200ml', price: 400, type: 'brand' },
    { name: 'Himalaya Body Lotion 200ml', price: 150, type: 'brand' },
  ],

  // DISHWASH
  'dishwash': [
    { name: 'Vim Liquid 500ml', price: 110, type: 'brand' },
    { name: 'Pril Liquid 500ml', price: 120, type: 'brand' },
    { name: 'Vim Bar (Pack of 3)', price: 50, type: 'variant' },
    { name: 'Exo Dishwash 500ml', price: 95, type: 'brand' },
  ],
  'vim': [
    { name: 'Pril Liquid 500ml', price: 120, type: 'brand' },
    { name: 'Vim Bar (Pack of 3)', price: 50, type: 'variant' },
    { name: 'Exo Dishwash 500ml', price: 95, type: 'brand' },
  ],

  // TOILET CLEANER
  'harpic': [
    { name: 'Domex Toilet Cleaner 500ml', price: 90, type: 'brand' },
    { name: 'Sanifresh 500ml', price: 75, type: 'brand' },
    { name: 'Harpic Power Plus 1L', price: 170, type: 'size' },
  ],

  // FLOOR CLEANER
  'floor cleaner': [
    { name: 'Lizol Floor Cleaner 1L', price: 175, type: 'brand' },
    { name: 'Dettol Floor Cleaner 1L', price: 200, type: 'brand' },
    { name: 'Lizol Citrus 500ml', price: 95, type: 'size' },
  ],
  'lizol': [
    { name: 'Dettol Floor Cleaner 1L', price: 200, type: 'brand' },
    { name: 'Presto Floor Cleaner 1L', price: 130, type: 'brand' },
    { name: 'Lizol 2L', price: 320, type: 'size' },
  ],

  // MOSQUITO
  'mosquito': [
    { name: 'All Out Liquid Vaporizer', price: 80, type: 'brand' },
    { name: 'Good Knight Liquid', price: 75, type: 'brand' },
    { name: 'Hit Spray 200ml', price: 160, type: 'variant' },
    { name: 'Mortein Coil (Pack of 10)', price: 45, type: 'variant' },
  ],

  // ROOM FRESHENER
  'freshener': [
    { name: 'Ambi Pur Spray 275ml', price: 220, type: 'brand' },
    { name: 'Odonil Air Freshener', price: 80, type: 'brand' },
    { name: 'Godrej Aer Spray 220ml', price: 180, type: 'brand' },
  ],

  // OLIVE OIL
  'olive oil': [
    { name: 'Figaro Olive Oil 250ml', price: 220, type: 'brand' },
    { name: 'Borges Olive Oil 250ml', price: 280, type: 'brand' },
    { name: 'Del Monte Olive Oil 500ml', price: 450, type: 'size' },
  ],

  // GARLIC
  'garlic': [
    { name: 'Garlic 250g', price: 50, type: 'size' },
    { name: 'Ginger Garlic Paste 200g', price: 55, type: 'variant' },
    { name: 'Garlic Powder 50g', price: 40, type: 'variant' },
  ],

  // GINGER
  'ginger': [
    { name: 'Ginger 100g', price: 15, type: 'size' },
    { name: 'Ginger Garlic Paste 200g', price: 55, type: 'variant' },
    { name: 'Ginger Powder 50g', price: 35, type: 'variant' },
  ],

  // MIXED NUTS / DRY FRUITS
  'nuts': [
    { name: 'Mixed Nuts 400g', price: 350, type: 'size' },
    { name: 'Almonds 200g', price: 250, type: 'variant' },
    { name: 'Cashews 200g', price: 280, type: 'variant' },
    { name: 'Trail Mix 200g', price: 200, type: 'variant' },
  ],

  // BUTTER
  'butter': [
    { name: 'Amul Butter 500g', price: 280, type: 'size' },
    { name: 'Amul Butter 100g', price: 55, type: 'size' },
    { name: 'Britannia Bread Butter 100g', price: 52, type: 'brand' },
    { name: 'Mother Dairy Butter 100g', price: 50, type: 'brand' },
  ],

  // CAKE
  'cake': [
    { name: 'Birthday Cake 500g', price: 350, type: 'size' },
    { name: 'Birthday Cake 2kg', price: 1100, type: 'size' },
    { name: 'Chocolate Truffle Cake 1kg', price: 700, type: 'variant' },
    { name: 'Red Velvet Cake 1kg', price: 750, type: 'variant' },
  ],

  // SWEETS
  'sweet': [
    { name: 'Haldiram Rasgulla 500g', price: 150, type: 'brand' },
    { name: 'Haldiram Gulab Jamun 500g', price: 160, type: 'variant' },
    { name: 'Bikano Soan Papdi 250g', price: 100, type: 'brand' },
    { name: 'Cadbury Celebrations Box', price: 350, type: 'brand' },
  ],

  // CELEBRATIONS BOX
  'celebrations': [
    { name: 'Cadbury Dairy Milk Silk 150g', price: 180, type: 'variant' },
    { name: 'Ferrero Rocher 16pc', price: 550, type: 'brand' },
    { name: 'Haldiram Sweets Box 500g', price: 300, type: 'brand' },
    { name: 'Cadbury Celebrations Premium', price: 500, type: 'size' },
  ],
};

export function getAlternatives(productName: string): ProductAlternative[] {
  const nameLower = productName.toLowerCase();

  // First: direct key match (original product name contains the key)
  for (const [key, alternatives] of Object.entries(PRODUCT_ALTERNATIVES)) {
    if (nameLower.includes(key)) {
      // Return alternatives excluding the current product
      return alternatives.filter(alt => alt.name.toLowerCase() !== nameLower);
    }
  }

  // Second: reverse match (current product is one of the alternatives in a group)
  for (const [key, alternatives] of Object.entries(PRODUCT_ALTERNATIVES)) {
    const isInGroup = alternatives.some(alt => nameLower.includes(alt.name.toLowerCase()) || alt.name.toLowerCase().includes(nameLower));
    if (isInGroup) {
      // Return the original product (from key) + other alternatives, minus current
      const originalItem: ProductAlternative = {
        name: getOriginalProductName(key),
        price: getOriginalPrice(key),
        type: 'brand'
      };
      const allOptions = [originalItem, ...alternatives];
      return allOptions.filter(alt => alt.name.toLowerCase() !== nameLower);
    }
  }

  return [];
}

// Helper: get a display name for the original product category key
function getOriginalProductName(key: string): string {
  const names: Record<string, string> = {
    'maggi': 'Maggi Noodles (Pack of 4)',
    'chicken': 'Chicken 500g',
    'biryani masala': 'MDH Biryani Masala 50g',
    'basmati rice': 'Basmati Rice 1kg',
    'rice 5kg': 'Rice 5kg',
    'coca-cola': 'Coca-Cola 2L',
    'soft drink': 'Soft Drinks 2L',
    'chips': "Lay's Classic Chips 200g",
    'kurkure': 'Kurkure Masala Munch 150g',
    'nachos': 'Nachos with Cheese Dip',
    'namkeen': 'Haldiram Namkeen Mix 400g',
    'haldiram': 'Haldiram Namkeen Mix 400g',
    'popcorn': 'ACT II Butter Popcorn (Pack of 3)',
    'chocolate': 'Cadbury Dairy Milk 100g',
    'cadbury': 'Cadbury Dairy Milk Silk 150g',
    'biscuit': 'Parle-G Biscuits',
    'oreo': 'Oreo Biscuits 300g',
    'parle': 'Parle-G Biscuits',
    'hide & seek': 'Hide & Seek Biscuits',
    'coffee': 'Nescafe Classic 100g',
    'nescafe': 'Nescafe Classic 100g',
    'tea': 'Tata Tea Premium 250g',
    'milk': 'Amul Milk 500ml',
    'oil': 'Cooking Oil 1L',
    'bread': 'Bread (White/Brown)',
    'eggs': 'Eggs (6 Pack)',
    'atta': 'Atta Whole Wheat 5kg',
    'sugar': 'Sugar 500g',
    'curd': 'Curd 400g',
    'onion': 'Onions 1kg',
    'tomato': 'Tomatoes 1kg',
    'ghee': 'Ghee 200g',
    'paneer': 'Paneer 200g',
    'pasta': 'Pasta 500g',
    'pasta sauce': 'Pasta Sauce 400g',
    'cheese': 'Cheese (Mozzarella) 200g',
    'ice cream': 'Ice Cream 500ml',
    'energy drink': 'Red Bull 250ml',
    'red bull': 'Red Bull Energy Drink 250ml',
    'water': 'Bisleri Water 5L',
    'bisleri': 'Bisleri Water 5L',
    'juice': 'Tropicana Orange Juice 1L',
    'pringles': 'Pringles Original 134g',
    'paper plate': 'Paper Plates Pack of 50',
    'paper cup': 'Paper Cups Pack of 50',
    'napkin': 'Paper Napkins Pack of 100',
    'balloon': 'Party Balloons Pack of 25',
    'candle': 'Candles Pack of 10',
    'batteries': 'AA Batteries Pack of 4',
    'hand wash': 'Dettol Hand Wash 200ml',
    'dettol': 'Dettol Hand Wash 200ml',
    'toothpaste': 'Colgate MaxFresh 150g',
    'colgate': 'Colgate MaxFresh 150g',
    'shampoo': 'Head & Shoulders 340ml',
    'lotion': 'Nivea Body Lotion 200ml',
    'dishwash': 'Vim Dishwash Liquid 500ml',
    'vim': 'Vim Dishwash Liquid 500ml',
    'harpic': 'Harpic Toilet Cleaner 500ml',
    'floor cleaner': 'Lizol Floor Cleaner 1L',
    'lizol': 'Lizol Floor Cleaner 1L',
    'mosquito': 'Hit Mosquito Spray 200ml',
    'freshener': 'Room Freshener 240ml',
    'olive oil': 'Olive Oil 250ml',
    'garlic': 'Garlic 100g',
    'ginger': 'Ginger 50g',
    'nuts': 'Mixed Nuts 200g',
    'butter': 'Amul Butter 500g',
    'cake': 'Birthday Cake 1kg',
    'sweet': 'Sweets Box 500g',
    'celebrations': 'Cadbury Celebrations Box',
  };
  return names[key] || key;
}

function getOriginalPrice(key: string): number {
  const prices: Record<string, number> = {
    'maggi': 56,
    'chicken': 250,
    'biryani masala': 75,
    'basmati rice': 180,
    'rice 5kg': 350,
    'coca-cola': 95,
    'soft drink': 190,
    'chips': 80,
    'kurkure': 50,
    'nachos': 150,
    'namkeen': 150,
    'haldiram': 150,
    'popcorn': 120,
    'chocolate': 100,
    'cadbury': 180,
    'biscuit': 20,
    'oreo': 70,
    'parle': 20,
    'hide & seek': 40,
    'coffee': 280,
    'nescafe': 280,
    'tea': 240,
    'milk': 30,
    'oil': 160,
    'bread': 45,
    'eggs': 50,
    'atta': 320,
    'sugar': 40,
    'curd': 45,
    'onion': 40,
    'tomato': 50,
    'ghee': 120,
    'paneer': 90,
    'pasta': 90,
    'pasta sauce': 150,
    'cheese': 180,
    'ice cream': 200,
    'energy drink': 125,
    'red bull': 125,
    'water': 60,
    'bisleri': 60,
    'juice': 110,
    'pringles': 199,
    'paper plate': 150,
    'paper cup': 90,
    'napkin': 80,
    'balloon': 100,
    'candle': 60,
    'batteries': 120,
    'hand wash': 70,
    'dettol': 70,
    'toothpaste': 110,
    'colgate': 110,
    'shampoo': 350,
    'lotion': 200,
    'dishwash': 110,
    'vim': 110,
    'harpic': 95,
    'floor cleaner': 175,
    'lizol': 175,
    'mosquito': 160,
    'freshener': 140,
    'olive oil': 250,
    'garlic': 30,
    'ginger': 10,
    'nuts': 180,
    'butter': 280,
    'cake': 600,
    'sweet': 300,
    'celebrations': 350,
  };
  return prices[key] || 100;
}
