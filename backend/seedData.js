const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Recipe = require("./models/recipe");
const User = require("./models/user");

const path = require("path");
dotenv.config({ path: path.resolve(__dirname, ".env") });

const realisticUsers = [
  {
    name: "Store Administrator",
    email: "admin@foodninja.com",
    password: "admin123",
    role: "admin",
    phone: "9988776655",
    address: "Food Ninja HQ, Delhi"
  },
  {
    name: "Mohd Zaid",
    email: "zaid@foodninja.com",
    password: "password123",
    role: "user",
    phone: "9876543210",
    address: "Flat 402, Green Avenue, New Delhi"
  }
];

// Our 8 Signature Hand-Crafted Dishes
const ourSignatureDishes = [
  {
    name: "Hyderabadi Dum Biryani",
    category: "Biryani",
    price: 260,
    caloriesPerServing: 260,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
    isVeg: false,
    rating: 4.8,
    reviewCount: 320,
    deliveryTime: "30-35 mins",
    cuisine: "Hyderabadi",
    description: "Aromatic basmati rice layered with marinated tender chicken and authentic royal spices, served with raita.",
    ingredients: ["Basmati Rice", "Tender Chicken", "Saffron", "Caramelized Onions", "Ghee", "Royal Spices"]
  },
  {
    name: "Paneer Butter Masala",
    category: "North Indian",
    price: 220,
    caloriesPerServing: 220,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    rating: 4.7,
    reviewCount: 240,
    deliveryTime: "25-30 mins",
    cuisine: "North Indian",
    description: "Soft paneer cubes cooked in a rich, buttery and creamy tomato-cashew gravy with a hint of kasuri methi.",
    ingredients: ["Fresh Paneer", "Butter", "Cashew Paste", "Tomato Puree", "Cream", "Kasuri Methi"]
  },
  {
    name: "Farmhouse Cheese Burst Pizza",
    category: "Pizza",
    price: 320,
    caloriesPerServing: 320,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    rating: 4.6,
    reviewCount: 190,
    deliveryTime: "20-25 mins",
    cuisine: "Italian",
    description: "Loaded with capsicum, crisp onions, juicy tomatoes, mushrooms and liquid cheese oozing from crust.",
    ingredients: ["Crisp Crust", "Mozzarella Cheese", "Capsicum", "Onion", "Mushroom", "Herb Sauce"]
  },
  {
    name: "Crispy Chicken Zinger Burger",
    category: "Burgers",
    price: 180,
    caloriesPerServing: 180,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
    isVeg: false,
    rating: 4.5,
    reviewCount: 150,
    deliveryTime: "20-25 mins",
    cuisine: "American",
    description: "Extra crispy batter-fried chicken fillet topped with fresh lettuce and signature mayo inside soft toasted sesame buns.",
    ingredients: ["Chicken Patty", "Sesame Bun", "Iceberg Lettuce", "Creamy Mayo", "Secret Spice Mix"]
  },
  {
    name: "Veg Hakka Noodles & Manchurian",
    category: "Chinese",
    price: 210,
    caloriesPerServing: 210,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    rating: 4.6,
    reviewCount: 175,
    deliveryTime: "25-30 mins",
    cuisine: "Indo-Chinese",
    description: "Wok-tossed noodles with shredded vegetables served alongside savory vegetable Manchurian balls in rich garlic soya gravy.",
    ingredients: ["Noodles", "Cabbage", "Capsicum", "Manchurian Balls", "Soya Sauce", "Spring Onions"]
  },
  {
    name: "Double Egg Chicken Roll",
    category: "Rolls",
    price: 150,
    caloriesPerServing: 150,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80",
    isVeg: false,
    rating: 4.7,
    reviewCount: 210,
    deliveryTime: "15-20 mins",
    cuisine: "Kolkata Street Food",
    description: "Flaky paratha layered with double egg and packed with spiced grilled chicken chunks, sliced onions and tangy chutney.",
    ingredients: ["Lachha Paratha", "2 Eggs", "Spiced Chicken", "Sliced Onion", "Green Chutney", "Chaat Masala"]
  },
  {
    name: "Steamed Chicken Momos (8 Pcs)",
    category: "Momos",
    price: 130,
    caloriesPerServing: 130,
    image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=800&auto=format&fit=crop&q=80",
    isVeg: false,
    rating: 4.8,
    reviewCount: 290,
    deliveryTime: "15-20 mins",
    cuisine: "Tibetan",
    description: "Juicy minced chicken and herb dumplings steamed to perfection, served with spicy red chili dip and mayonnaise.",
    ingredients: ["Chicken Mince", "Spring Onion", "Ginger Garlic", "Red Chili Sauce", "Momo Wrapper"]
  },
  {
    name: "Chocolate Belgian Thick Shake",
    category: "Beverages",
    price: 140,
    caloriesPerServing: 140,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    rating: 4.9,
    reviewCount: 180,
    deliveryTime: "15-20 mins",
    cuisine: "Beverages",
    description: "Rich dark Belgian chocolate blended with creamy ice cream and topped with chocolate fudge and chips.",
    ingredients: ["Belgian Cocoa", "Vanilla Ice Cream", "Fresh Milk", "Chocolate Chips", "Choco Fudge"]
  }
];

const loadAllFoods = () => {
  const desktopFilePath = "C:\\Users\\user\\Desktop\\recipes.txt";
  let rawRecipes = [];

  if (fs.existsSync(desktopFilePath)) {
    const rawData = fs.readFileSync(desktopFilePath, "utf8");
    const parsed = JSON.parse(rawData);
    rawRecipes = parsed.recipes || [];
  }

  const categoryMap = (item) => {
    const n = item.name.toLowerCase();
    const tags = (item.tags || []).map(t => t.toLowerCase());
    if (n.includes("biryani") || tags.includes("biryani")) return "Biryani";
    if (n.includes("pizza") || tags.includes("pizza")) return "Pizza";
    if (n.includes("burger") || tags.includes("burger")) return "Burgers";
    if (n.includes("noodles") || n.includes("ramen") || n.includes("stir-fry") || n.includes("momo")) return "Chinese";
    if (n.includes("pasta") || n.includes("alfredo") || n.includes("bruschetta")) return "Italian";
    if (n.includes("keema") || n.includes("karahi") || n.includes("saag") || n.includes("paneer")) return "North Indian";
    if (n.includes("kebab") || n.includes("roll")) return "Rolls";
    if (n.includes("cookie") || n.includes("cake") || n.includes("dessert") || tags.includes("dessert")) return "Desserts";
    if (n.includes("shake") || n.includes("smoothie") || n.includes("drink")) return "Beverages";
    return item.cuisine || "Specialty";
  };

  const isItemVeg = (ingredients) => {
    const nonVegKeywords = ["chicken", "beef", "shrimp", "mutton", "pork", "fish", "meat", "lamb", "egg", "bacon", "salmon"];
    const ingText = ingredients.join(" ").toLowerCase();
    return !nonVegKeywords.some(kw => ingText.includes(kw));
  };

  const calculatePrice = (r) => {
    const base = 140 + (r.id * 7) % 180;
    return Math.round(base / 10) * 10;
  };

  let idCounter = 1;
  const combined = [];

  // 1. Add our 8 Signature Hand-Crafted Dishes first
  ourSignatureDishes.forEach((d) => {
    combined.push({
      ...d,
      id: idCounter++
    });
  });

  // 2. Add Dishes from recipes.txt
  rawRecipes.forEach((r) => {
    const isVeg = isItemVeg(r.ingredients || []);
    const price = calculatePrice(r);
    const category = categoryMap(r);

    combined.push({
      id: idCounter++,
      name: r.name,
      category: category,
      price: price,
      caloriesPerServing: price,
      image: r.image,
      isVeg: isVeg,
      rating: r.rating || 4.7,
      reviewCount: r.reviewCount || 75,
      deliveryTime: `${(r.prepTimeMinutes || 15) + 10}-${(r.prepTimeMinutes || 15) + 20} mins`,
      cuisine: r.cuisine || "Continental",
      description: `Delicious ${r.cuisine || 'chef-crafted'} style ${r.name}, prepared fresh with aromatic herbs and premium quality ingredients.`,
      ingredients: r.ingredients || [],
      instructions: r.instructions || []
    });
  });

  return combined;
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas successfully");

    const allFoods = loadAllFoods();

    console.log(`Loaded TOTAL ${allFoods.length} Food Dishes (8 Signature + 30 File Recipes)`);

    await User.deleteMany({});
    await Recipe.deleteMany({});

    await User.insertMany(realisticUsers);
    console.log("Inserted Users:", realisticUsers.length);

    await Recipe.insertMany(allFoods);
    console.log(`Inserted ${allFoods.length} Food Dishes into MongoDB Atlas!`);

    console.log("Seeding finished successfully with ALL food data preserved!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seed();
