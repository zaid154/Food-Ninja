const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

const Recipe = require("./models/recipeModel");
const User = require("./models/userModel");
const Review = require("./models/reviewModel");
const Order = require("./models/orderModel");
const Category = require("./models/categoryModel");
const seedDishes = require("./data/seedDishes");
const { realisticReviews, realisticOrders } = require("./data/seedOrdersAndReviews");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const defaultCategories = [
  { name: "Biryani", slug: "biryani", bg: "bg-[#f4faee]", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80", description: "Aromatic dum biryanis layered with fragrant basmati rice and rich spices.", displayOrder: 1, isActive: true, isFeatured: true },
  { name: "Pizza", slug: "pizza", bg: "bg-[#fff3eb]", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80", description: "Wood-fired and pan-crust artisanal pizzas with gourmet cheese.", displayOrder: 2, isActive: true, isFeatured: true },
  { name: "Burgers", slug: "burgers", bg: "bg-[#fff8e7]", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80", description: "Juicy grilled patties in toasted brioche buns with signature dressings.", displayOrder: 3, isActive: true, isFeatured: true },
  { name: "Chinese", slug: "chinese", bg: "bg-[#fef2f2]", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&auto=format&fit=crop&q=80", description: "Sizzling wok tossed noodles, Manchurian, fried rice, and dimsums.", displayOrder: 4, isActive: true, isFeatured: true },
  { name: "Indian", slug: "indian", bg: "bg-[#fef9c3]", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&auto=format&fit=crop&q=80", description: "Rich gravies, paneer specialties, dals, tandoori curries, and breads.", displayOrder: 5, isActive: true, isFeatured: true },
  { name: "Rolls", slug: "rolls", bg: "bg-[#f0fdf4]", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300&auto=format&fit=crop&q=80", description: "Freshly tossed kathi rolls, egg wraps, and chicken shawarmas.", displayOrder: 6, isActive: true, isFeatured: true },
  { name: "Momos", slug: "momos", bg: "bg-[#fdf2f8]", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=300&auto=format&fit=crop&q=80", description: "Steamed, fried, and tandoori dumplings filled with flavorful stuffing.", displayOrder: 7, isActive: true, isFeatured: false },
  { name: "Desserts", slug: "desserts", bg: "bg-[#faf5ff]", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&auto=format&fit=crop&q=80", description: "Mouthwatering cakes, pastries, brownies, and Indian sweets.", displayOrder: 8, isActive: true, isFeatured: false },
  { name: "Beverages", slug: "beverages", bg: "bg-[#eff6ff]", img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&auto=format&fit=crop&q=80", description: "Refreshing mojitos, cold coffees, shakes, and wellness teas.", displayOrder: 9, isActive: true, isFeatured: false },
  { name: "Snacks", slug: "snacks", bg: "bg-[#fef3c7]", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop&q=80", description: "Crispy fries, nachos, nuggets, and evening chai-time snacks.", displayOrder: 10, isActive: true, isFeatured: false },
  { name: "Healthy", slug: "healthy", bg: "bg-[#ecfdf5]", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=80", description: "Fresh garden salads, grain bowls, detox smoothies, and protein meals.", displayOrder: 11, isActive: true, isFeatured: false },
];

const realisticUsers = [
  { name: "Store Administrator", email: "admin@foodninja.com", password: "admin123", role: "admin", phone: "9988776655", address: "Food Ninja HQ, Connaught Place, New Delhi - 110001" },
  { name: "Mohd Zaid", email: "zaid@foodninja.com", password: "password123", role: "user", phone: "9999201255", address: "B-13/2, Street No-07, Delhi NCR - 110094" },
  { name: "Sara Khan", email: "sara@foodninja.com", password: "password123", role: "user", phone: "9876543210", address: "Flat 204, Lotus Heights, Indirapuram, Ghaziabad - 201014" },
  { name: "Aarav Sharma", email: "aarav@gmail.com", password: "password123", role: "user", phone: "9811223344", address: "House 42, Block C, Green Park, New Delhi - 110016" },
  { name: "Priya Verma", email: "priya.verma@gmail.com", password: "password123", role: "user", phone: "9871100223", address: "Tower B-502, Ace City, Sector 1, Greater Noida West - 201306" }
];

const ourSignatureDishes = [
  {
    name: "Hyderabadi Dum Biryani", category: "Biryani", price: 260, caloriesPerServing: 260,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
    isVeg: false, dietary: "Non-Veg", rating: 4.8, reviewCount: 320, deliveryTime: "30-35 mins", cuisine: "Hyderabadi",
    description: "Aromatic basmati rice layered with marinated tender chicken and authentic royal spices, served with raita.",
    ingredients: ["Basmati Rice", "Tender Chicken", "Saffron", "Caramelized Onions", "Ghee", "Royal Spices"],
    instructions: ["Marinate chicken with spices and yogurt", "Parboil basmati rice with whole spices", "Layer rice and chicken in handi and dum cook on low flame for 30 minutes"]
  },
  {
    name: "Paneer Butter Masala", category: "North Indian", price: 220, caloriesPerServing: 220,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80",
    isVeg: true, dietary: "Veg", rating: 4.7, reviewCount: 240, deliveryTime: "25-30 mins", cuisine: "North Indian",
    description: "Soft paneer cubes cooked in a rich, buttery and creamy tomato-cashew gravy with a hint of kasuri methi.",
    ingredients: ["Fresh Paneer", "Butter", "Cashew Paste", "Tomato Puree", "Cream", "Kasuri Methi"],
    instructions: ["Saute tomatoes, cashew nuts and spices into smooth gravy", "Simmer with generous butter and fresh cream", "Add soft cottage cheese cubes and sprinkle crushed fenugreek"]
  },
  {
    name: "Farmhouse Cheese Burst Pizza", category: "Pizza", price: 320, caloriesPerServing: 320,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
    isVeg: true, dietary: "Veg", rating: 4.6, reviewCount: 190, deliveryTime: "20-25 mins", cuisine: "Italian",
    description: "Loaded with capsicum, crisp onions, juicy tomatoes, mushrooms and liquid cheese oozing from crust.",
    ingredients: ["Crisp Crust", "Mozzarella Cheese", "Capsicum", "Onion", "Mushroom", "Herb Sauce"],
    instructions: ["Roll out fresh dough base and inject liquid cheese filling", "Spread herb tomato sauce and mozzarella", "Top with capsicum, mushrooms and bake until cheese bubbles"]
  },
  {
    name: "Crispy Chicken Zinger Burger", category: "Burgers", price: 180, caloriesPerServing: 180,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
    isVeg: false, dietary: "Non-Veg", rating: 4.5, reviewCount: 150, deliveryTime: "20-25 mins", cuisine: "American",
    description: "Extra crispy batter-fried chicken fillet topped with fresh lettuce and signature mayo inside soft toasted sesame buns.",
    ingredients: ["Chicken Patty", "Sesame Bun", "Iceberg Lettuce", "Creamy Mayo", "Secret Spice Mix"],
    instructions: ["Marinate chicken fillet in spiced buttermilk", "Double dread in seasoned flour and deep fry until ultra crunchy", "Assemble on toasted sesame buns with iceberg lettuce and mayonnaise"]
  },
  {
    name: "Veg Hakka Noodles & Manchurian", category: "Chinese", price: 210, caloriesPerServing: 210,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80",
    isVeg: true, dietary: "Veg", rating: 4.6, reviewCount: 175, deliveryTime: "25-30 mins", cuisine: "Indo-Chinese",
    description: "Wok-tossed noodles with shredded vegetables served alongside savory vegetable Manchurian balls in rich garlic soya gravy.",
    ingredients: ["Noodles", "Cabbage", "Capsicum", "Manchurian Balls", "Soya Sauce", "Spring Onions"],
    instructions: ["Boil noodles al dente and toss in fiery wok with garlic and julienned veggies", "Shape vegetable balls and deep fry until crispy", "Simmer balls in spicy soya-garlic sauce and serve alongside noodles"]
  },
  {
    name: "Double Egg Chicken Roll", category: "Rolls", price: 150, caloriesPerServing: 150,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80",
    isVeg: false, dietary: "Non-Veg", rating: 4.7, reviewCount: 210, deliveryTime: "15-20 mins", cuisine: "Kolkata Street Food",
    description: "Flaky paratha layered with double egg and packed with spiced grilled chicken chunks, sliced onions and tangy chutney.",
    ingredients: ["Lachha Paratha", "2 Eggs", "Spiced Chicken", "Sliced Onion", "Green Chutney", "Chaat Masala"],
    instructions: ["Pan fry paratha on flat tawa with two beaten eggs", "Place grilled spiced chicken chunks in center line", "Add sliced onions, green chili chutney, squeeze lemon and roll tightly"]
  },
  {
    name: "Steamed Chicken Momos (8 Pcs)", category: "Momos", price: 130, caloriesPerServing: 130,
    image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=800&auto=format&fit=crop&q=80",
    isVeg: false, dietary: "Non-Veg", rating: 4.8, reviewCount: 290, deliveryTime: "15-20 mins", cuisine: "Tibetan",
    description: "Juicy minced chicken and herb dumplings steamed to perfection, served with spicy red chili dip and mayonnaise.",
    ingredients: ["Chicken Mince", "Spring Onion", "Ginger Garlic", "Red Chili Sauce", "Momo Wrapper"],
    instructions: ["Season finely minced chicken with scallions, garlic and sesame oil", "Pleat carefully into thin dough wrappers", "Steam in momo steamer for 10 minutes and serve piping hot with red chili dip"]
  },
  {
    name: "Chocolate Belgian Thick Shake", category: "Beverages", price: 140, caloriesPerServing: 140,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80",
    isVeg: true, dietary: "Veg", rating: 4.9, reviewCount: 180, deliveryTime: "15-20 mins", cuisine: "Beverages",
    description: "Rich dark Belgian chocolate blended with creamy ice cream and topped with chocolate fudge and chips.",
    ingredients: ["Belgian Cocoa", "Vanilla Ice Cream", "Fresh Milk", "Chocolate Chips", "Choco Fudge"],
    instructions: ["Blend dark Belgian cocoa with chilled whole milk and premium ice cream", "Drizzle chocolate fudge sauce along the inside of tall glass", "Pour thick shake and garnish with chocolate chips and fudge drizzle"]
  }
];

const noPortionNames = new Set([
  "Chocolate Belgian Thick Shake", "Kashmiri Shahi Kehwa with Almonds", "Madurai Special Jigarthanda",
  "South Indian Filter Coffee (2 Cups)", "Crispy Chicken Zinger Burger", "Classic Mumbai Vada Pav (2 Pcs)",
  "Double Smash Cheeseburger with Brioche", "Mathura Ke Pede (250g)", "Rajasthani Malai Ghevar",
  "Silao Ka Khaja (250g)", "Bihari Traditional Thekua (250g)", "Crispy Fafda Jalebi Combo",
  "Maharashtrian Puran Poli (2 Pcs)", "Steamed Ukadiche Modak (4 Pcs)", "Traditional Goan Bebinca (2 Slices)",
  "Traditional Mysore Pak (250g)", "Kolkata Sponge Rosogolla (4 Pcs)", "Baked Mishti Doi (Clay Pot)",
  "Odisha Chhena Poda", "Classic Italian Tiramisu", "Thai Mango Sticky Rice with Coconut Cream",
  "New York Style Baked Cheesecake", "Steamed Chicken Momos (8 Pcs)", "Steamed Crystal Prawn Dim Sum (6 Pcs)",
  "Salmon Avocado California Sushi Roll (8 Pcs)", "Gujarati Nylon Khaman Dhokla", "Gujarati Khandvi Rolls",
  "Kanda Batata Poha", "Jodhpur Pyaaz Ki Kachori (2 Pcs)", "Maddur Vada Crispy Snack (4 Pcs)",
  "Steamed Idli & Medu Vada Combo"
]);

const addSeedPortionPrices = (dish) => {
  if (dish.category === "Beverages" || dish.category === "Burgers" || noPortionNames.has(dish.name)) {
    return { ...dish, hasPortions: false };
  }

  const fullPrice = Number(dish.price) || 0;
  const roundToTen = (amt) => Math.max(10, Math.round(amt / 10) * 10);
  const halfPrice = roundToTen(fullPrice * 0.65);
  const quarterPrice = roundToTen(fullPrice * 0.40);

  let servingInfo = "Full Plate: Standard · Half Plate: Regular · Quarter: Small";
  if (dish.category === "Biryani") {
    servingInfo = "Full: 750g (Serves 2–3) · Half: 450g (Serves 1–2) · Quarter: 250g (Serves 1)";
  } else if (dish.category === "North Indian" || dish.category === "Indian") {
    servingInfo = "Full: 650ml (Serves 2–3) · Half: 400ml (Serves 1–2) · Quarter: 220ml (Serves 1)";
  } else if (dish.category === "Chinese" || dish.category === "Asian") {
    servingInfo = "Full: 500g (Serves 2) · Half: 320g (Serves 1) · Quarter: 200g (Quick Bite)";
  } else if (dish.category === "Rolls") {
    servingInfo = "Full (Double Roll) · Half (Single Roll) · Quarter (Tasting Wrap)";
  } else if (dish.category === "Street Food") {
    servingInfo = "Full Plate (Double) · Half Plate (Single) · Quarter (Quick Taste)";
  }

  return {
    ...dish,
    hasPortions: true,
    halfPrice,
    quarterPrice,
    servingInfo
  };
};

const loadAllFoods = () => {
  let idCounter = 1;
  const combined = [];

  ourSignatureDishes.forEach((d) => combined.push({ ...d, id: idCounter++ }));
  seedDishes.forEach((d) => combined.push({ ...d, id: idCounter++ }));

  return combined.map(addSeedPortionPrices);
};

const seed = async () => {
  try {
    const mongoUri = process.env.CONNECTION_STRING || process.env.MONGO_URI;
    if (!mongoUri) throw new Error("No MongoDB connection string found in process.env.CONNECTION_STRING or MONGO_URI");

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);

    const allFoods = loadAllFoods();

    // 1. Users
    await User.deleteMany({});
    await User.insertMany(realisticUsers);

    // 2. Categories
    await Category.deleteMany({});
    await Category.insertMany(defaultCategories);

    // 3. Recipes / Dishes
    await Recipe.deleteMany({});
    await Recipe.insertMany(allFoods);

    // 4. Reviews (55+ authentic reviews)
    await Review.deleteMany({});
    await Review.insertMany(realisticReviews);

    // Update real review averages and counts in Recipes
    const reviewStats = await Review.aggregate([
      { $group: { _id: "$recipeId", count: { $sum: 1 }, avgRating: { $avg: "$rating" } } }
    ]);
    for (const stat of reviewStats) {
      await Recipe.findOneAndUpdate(
        { id: stat._id },
        { rating: Number(stat.avgRating.toFixed(1)), reviewCount: stat.count }
      );
    }

    // 5. Orders (18 realistic orders with portions)
    await Order.deleteMany({});
    await Order.insertMany(realisticOrders);

    console.log(`=======================================================`);
    console.log(`DATABASE SEEDED SUCCESSFULLY!`);
    console.log(`- Dishes: ${allFoods.length} (${allFoods.filter(f => f.hasPortions).length} with Full/Half/Quarter Portions)`);
    console.log(`- Categories: ${defaultCategories.length}`);
    console.log(`- Users: ${realisticUsers.length}`);
    console.log(`- Reviews: ${realisticReviews.length} Authentic Customer Reviews across products`);
    console.log(`- Orders: ${realisticOrders.length} Realistic Orders in Order History`);
    console.log(`=======================================================`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

if (require.main === module) seed();

module.exports = { defaultCategories, realisticUsers, ourSignatureDishes, loadAllFoods };
