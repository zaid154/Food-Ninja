const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

const Recipe = require("./models/recipe");
const User = require("./models/user");
const Review = require("./models/review");
const Order = require("./models/order");
const seedDishes = require("./data/seedDishes");

dotenv.config({ path: path.resolve(__dirname, ".env") });

// 1 Admin + 2 Verified Customer Accounts as requested
const realisticUsers = [
  {
    name: "Store Administrator",
    email: "admin@foodninja.com",
    password: "admin123",
    role: "admin",
    phone: "9988776655",
    address: "Food Ninja HQ, Connaught Place, New Delhi - 110001"
  },
  {
    name: "Mohd Zaid",
    email: "zaid@foodninja.com",
    password: "password123",
    role: "user",
    phone: "9999201255",
    address: "B-13/2, Street No-07, Delhi NCR - 110094"
  },
  {
    name: "Sara Khan",
    email: "sara@foodninja.com",
    password: "password123",
    role: "user",
    phone: "9876543210",
    address: "Flat 204, Lotus Heights, Indirapuram, Ghaziabad - 201014"
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
    dietary: "Non-Veg",
    rating: 4.8,
    reviewCount: 320,
    deliveryTime: "30-35 mins",
    cuisine: "Hyderabadi",
    description: "Aromatic basmati rice layered with marinated tender chicken and authentic royal spices, served with raita.",
    ingredients: ["Basmati Rice", "Tender Chicken", "Saffron", "Caramelized Onions", "Ghee", "Royal Spices"],
    instructions: ["Marinate chicken with spices and yogurt", "Parboil basmati rice with whole spices", "Layer rice and chicken in handi and dum cook on low flame for 30 minutes"]
  },
  {
    name: "Paneer Butter Masala",
    category: "North Indian",
    price: 220,
    caloriesPerServing: 220,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    dietary: "Veg",
    rating: 4.7,
    reviewCount: 240,
    deliveryTime: "25-30 mins",
    cuisine: "North Indian",
    description: "Soft paneer cubes cooked in a rich, buttery and creamy tomato-cashew gravy with a hint of kasuri methi.",
    ingredients: ["Fresh Paneer", "Butter", "Cashew Paste", "Tomato Puree", "Cream", "Kasuri Methi"],
    instructions: ["Saute tomatoes, cashew nuts and spices into smooth gravy", "Simmer with generous butter and fresh cream", "Add soft cottage cheese cubes and sprinkle crushed fenugreek"]
  },
  {
    name: "Farmhouse Cheese Burst Pizza",
    category: "Pizza",
    price: 320,
    caloriesPerServing: 320,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    dietary: "Veg",
    rating: 4.6,
    reviewCount: 190,
    deliveryTime: "20-25 mins",
    cuisine: "Italian",
    description: "Loaded with capsicum, crisp onions, juicy tomatoes, mushrooms and liquid cheese oozing from crust.",
    ingredients: ["Crisp Crust", "Mozzarella Cheese", "Capsicum", "Onion", "Mushroom", "Herb Sauce"],
    instructions: ["Roll out fresh dough base and inject liquid cheese filling", "Spread herb tomato sauce and mozzarella", "Top with capsicum, mushrooms and bake until cheese bubbles"]
  },
  {
    name: "Crispy Chicken Zinger Burger",
    category: "Burgers",
    price: 180,
    caloriesPerServing: 180,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
    isVeg: false,
    dietary: "Non-Veg",
    rating: 4.5,
    reviewCount: 150,
    deliveryTime: "20-25 mins",
    cuisine: "American",
    description: "Extra crispy batter-fried chicken fillet topped with fresh lettuce and signature mayo inside soft toasted sesame buns.",
    ingredients: ["Chicken Patty", "Sesame Bun", "Iceberg Lettuce", "Creamy Mayo", "Secret Spice Mix"],
    instructions: ["Marinate chicken fillet in spiced buttermilk", "Double dread in seasoned flour and deep fry until ultra crunchy", "Assemble on toasted sesame buns with iceberg lettuce and mayonnaise"]
  },
  {
    name: "Veg Hakka Noodles & Manchurian",
    category: "Chinese",
    price: 210,
    caloriesPerServing: 210,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    dietary: "Veg",
    rating: 4.6,
    reviewCount: 175,
    deliveryTime: "25-30 mins",
    cuisine: "Indo-Chinese",
    description: "Wok-tossed noodles with shredded vegetables served alongside savory vegetable Manchurian balls in rich garlic soya gravy.",
    ingredients: ["Noodles", "Cabbage", "Capsicum", "Manchurian Balls", "Soya Sauce", "Spring Onions"],
    instructions: ["Boil noodles al dente and toss in fiery wok with garlic and julienned veggies", "Shape vegetable balls and deep fry until crispy", "Simmer balls in spicy soya-garlic sauce and serve alongside noodles"]
  },
  {
    name: "Double Egg Chicken Roll",
    category: "Rolls",
    price: 150,
    caloriesPerServing: 150,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80",
    isVeg: false,
    dietary: "Non-Veg",
    rating: 4.7,
    reviewCount: 210,
    deliveryTime: "15-20 mins",
    cuisine: "Kolkata Street Food",
    description: "Flaky paratha layered with double egg and packed with spiced grilled chicken chunks, sliced onions and tangy chutney.",
    ingredients: ["Lachha Paratha", "2 Eggs", "Spiced Chicken", "Sliced Onion", "Green Chutney", "Chaat Masala"],
    instructions: ["Pan fry paratha on flat tawa with two beaten eggs", "Place grilled spiced chicken chunks in center line", "Add sliced onions, green chili chutney, squeeze lemon and roll tightly"]
  },
  {
    name: "Steamed Chicken Momos (8 Pcs)",
    category: "Momos",
    price: 130,
    caloriesPerServing: 130,
    image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=800&auto=format&fit=crop&q=80",
    isVeg: false,
    dietary: "Non-Veg",
    rating: 4.8,
    reviewCount: 290,
    deliveryTime: "15-20 mins",
    cuisine: "Tibetan",
    description: "Juicy minced chicken and herb dumplings steamed to perfection, served with spicy red chili dip and mayonnaise.",
    ingredients: ["Chicken Mince", "Spring Onion", "Ginger Garlic", "Red Chili Sauce", "Momo Wrapper"],
    instructions: ["Season finely minced chicken with scallions, garlic and sesame oil", "Pleat carefully into thin dough wrappers", "Steam in momo steamer for 10 minutes and serve piping hot with red chili dip"]
  },
  {
    name: "Chocolate Belgian Thick Shake",
    category: "Beverages",
    price: 140,
    caloriesPerServing: 140,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80",
    isVeg: true,
    dietary: "Veg",
    rating: 4.9,
    reviewCount: 180,
    deliveryTime: "15-20 mins",
    cuisine: "Beverages",
    description: "Rich dark Belgian chocolate blended with creamy ice cream and topped with chocolate fudge and chips.",
    ingredients: ["Belgian Cocoa", "Vanilla Ice Cream", "Fresh Milk", "Chocolate Chips", "Choco Fudge"],
    instructions: ["Blend dark Belgian cocoa with chilled whole milk and premium ice cream", "Drizzle chocolate fudge sauce along the inside of tall glass", "Pour thick shake and garnish with chocolate chips and fudge drizzle"]
  }
];

const loadAllFoods = () => {
  const possiblePaths = [
    "C:\\Users\\user\\Desktop\\All-Pojects\\recipes.txt",
    "C:\\Users\\user\\Desktop\\recipes.txt",
    path.resolve(__dirname, "recipes.txt"),
    path.resolve(__dirname, "../recipes.txt")
  ];

  let rawRecipes = [];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        const rawData = fs.readFileSync(p, "utf8");
        const parsed = JSON.parse(rawData);
        rawRecipes = parsed.recipes || [];
        console.log(`Loaded ${rawRecipes.length} recipes from: ${p}`);
        break;
      } catch (e) {
        console.warn(`Could not parse recipes from ${p}:`, e.message);
      }
    }
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

  // 1. Add our 8 Signature Hand-Crafted Dishes first (IDs 1 - 8)
  ourSignatureDishes.forEach((d) => {
    combined.push({
      ...d,
      id: idCounter++
    });
  });

  // 2. Add Dishes from recipes.txt (IDs 9 - 38)
  rawRecipes.forEach((r) => {
    const isVeg = isItemVeg(r.ingredients || []);
    const price = calculatePrice(r);
    const category = categoryMap(r);

    combined.push({
      id: idCounter++,
      name: r.name,
      category: category,
      price: price,
      caloriesPerServing: r.caloriesPerServing || price,
      image: r.image,
      isVeg: isVeg,
      dietary: isVeg ? "Veg" : "Non-Veg",
      rating: r.rating || 4.7,
      reviewCount: r.reviewCount || 75,
      deliveryTime: `${(r.prepTimeMinutes || 15) + 10}-${(r.prepTimeMinutes || 15) + 20} mins`,
      cuisine: r.cuisine || "Continental",
      description: `Delicious ${r.cuisine || 'chef-crafted'} style ${r.name}, prepared fresh with aromatic herbs and premium quality ingredients.`,
      ingredients: r.ingredients || [],
      instructions: r.instructions || []
    });
  });

  // 3. Add 120 Authentic Regional & World Dishes from seedDishes (IDs 39 - 158)
  seedDishes.forEach((d) => {
    combined.push({
      ...d,
      id: idCounter++
    });
  });

  return combined;
};

// Seed authentic customer reviews
const realisticReviews = [
  {
    recipeId: 1,
    userName: "Mohd Zaid",
    userEmail: "zaid@foodninja.com",
    rating: 5,
    comment: "The Hyderabadi Dum Biryani is absolutely top tier! The aroma of saffron and tender chicken melted in every bite. Highly recommended!"
  },
  {
    recipeId: 1,
    userName: "Sara Khan",
    userEmail: "sara@foodninja.com",
    rating: 5,
    comment: "Piping hot delivery and authentic royal spices. The portion size easily serves two. Will definitely order again!"
  },
  {
    recipeId: 2,
    userName: "Mohd Zaid",
    userEmail: "zaid@foodninja.com",
    rating: 5,
    comment: "Best Paneer Butter Masala in town! Silky, velvety gravy with fresh soft paneer cubes that melt instantly."
  },
  {
    recipeId: 2,
    userName: "Aarav Sharma",
    userEmail: "aarav@gmail.com",
    rating: 4,
    comment: "Creamy and rich tomato-cashew sauce with great flavor balance. Pairs amazingly well with butter naan."
  },
  {
    recipeId: 3,
    userName: "Sara Khan",
    userEmail: "sara@foodninja.com",
    rating: 5,
    comment: "Cheese burst crust actually oozes with cheese! Much better quality and fresher crust than big commercial chains."
  },
  {
    recipeId: 4,
    userName: "Rohan Kapoor",
    userEmail: "rohan@gmail.com",
    rating: 5,
    comment: "Super crunchy chicken zinger! Lettuce was fresh and the mayo spice blend was spot on."
  },
  {
    recipeId: 39, // Amritsari Chole Bhature
    userName: "Mohd Zaid",
    userEmail: "zaid@foodninja.com",
    rating: 5,
    comment: "Authentic Amritsari taste! The dark pindi chole had that genuine anardana tang, and bhature were fluffy and non-greasy."
  },
  {
    recipeId: 39,
    userName: "Sara Khan",
    userEmail: "sara@foodninja.com",
    rating: 5,
    comment: "Sunday brunch perfection. Came with delicious pickled onions and green chili chutney."
  },
  {
    recipeId: 40, // Murgh Makhani
    userName: "Mohd Zaid",
    userEmail: "zaid@foodninja.com",
    rating: 5,
    comment: "Rich, authentic old Delhi style butter chicken. Charcoal-smoked tandoori chicken chunks in pure buttery gravy!"
  },
  {
    recipeId: 41, // Dal Makhani
    userName: "Sara Khan",
    userEmail: "sara@foodninja.com",
    rating: 5,
    comment: "Slow cooked charcoal aroma is unmistakable. Pure white butter richness with creamy black lentils."
  },
  {
    recipeId: 58, // Rajasthani Dal Baati Churma
    userName: "Mohd Zaid",
    userEmail: "zaid@foodninja.com",
    rating: 5,
    comment: "Royal feast! Desi ghee fragrance filled the room. The churma was sweet and nutty, and dal had authentic marwari tadka."
  },
  {
    recipeId: 75, // Mumbai Pav Bhaji
    userName: "Sara Khan",
    userEmail: "sara@foodninja.com",
    rating: 5,
    comment: "Tastes straight out of Chowpatty! Buttery, spiced bhaji and soft butter-toasted pav buns."
  },
  {
    recipeId: 89, // Crispy Masala Dosa
    userName: "Mohd Zaid",
    userEmail: "zaid@foodninja.com",
    rating: 5,
    comment: "Paper thin golden crisp dosa with fragrant potato masala and authentic coconut chutney. 10/10!"
  }
];

// Seed realistic delivered orders so Delivered Order Verification unlocks instant review privileges
const realisticOrders = [
  {
    id: 1001,
    userEmail: "zaid@foodninja.com",
    customerName: "Mohd Zaid",
    phone: "9999201255",
    address: "B-13/2, Street No-07, Delhi NCR - 110094",
    payment: "UPI / Online Payment",
    items: [
      { id: 1, name: "Hyderabadi Dum Biryani", price: 260, quantity: 1, isVeg: false, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80" },
      { id: 2, name: "Paneer Butter Masala", price: 220, quantity: 1, isVeg: true, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80" }
    ],
    subtotal: 480,
    deliveryFee: 30,
    taxes: 24,
    total: 534,
    estDelivery: "Delivered",
    status: "Delivered",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  },
  {
    id: 1002,
    userEmail: "zaid@foodninja.com",
    customerName: "Mohd Zaid",
    phone: "9999201255",
    address: "B-13/2, Street No-07, Delhi NCR - 110094",
    payment: "Cash on Delivery",
    items: [
      { id: 39, name: "Amritsari Chole Bhature", price: 160, quantity: 2, isVeg: true, image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&auto=format&fit=crop&q=80" },
      { id: 40, name: "Murgh Makhani (Butter Chicken)", price: 340, quantity: 1, isVeg: false, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80" },
      { id: 89, name: "Crispy Masala Dosa", price: 140, quantity: 1, isVeg: true, image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&auto=format&fit=crop&q=80" }
    ],
    subtotal: 800,
    deliveryFee: 0,
    taxes: 40,
    total: 840,
    estDelivery: "Delivered",
    status: "Delivered",
    date: new Date(Date.now() - 48 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  },
  {
    id: 1003,
    userEmail: "sara@foodninja.com",
    customerName: "Sara Khan",
    phone: "9876543210",
    address: "Flat 204, Lotus Heights, Indirapuram, Ghaziabad - 201014",
    payment: "Credit Card",
    items: [
      { id: 1, name: "Hyderabadi Dum Biryani", price: 260, quantity: 1, isVeg: false, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80" },
      { id: 3, name: "Farmhouse Cheese Burst Pizza", price: 320, quantity: 1, isVeg: true, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80" },
      { id: 41, name: "Dal Makhani Charcoal Simmered", price: 240, quantity: 1, isVeg: true, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80" }
    ],
    subtotal: 820,
    deliveryFee: 30,
    taxes: 41,
    total: 891,
    estDelivery: "Delivered",
    status: "Delivered",
    date: new Date(Date.now() - 12 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  },
  {
    id: 1004,
    userEmail: "zaid@foodninja.com",
    customerName: "Mohd Zaid",
    phone: "9999201255",
    address: "B-13/2, Street No-07, Delhi NCR - 110094",
    payment: "UPI / Online Payment",
    items: [
      { id: 75, name: "Mumbai Butter Pav Bhaji", price: 170, quantity: 2, isVeg: true, image: "https://images.unsplash.com/photo-1606471191009-63994c53433b?w=800&auto=format&fit=crop&q=80" }
    ],
    subtotal: 340,
    deliveryFee: 30,
    taxes: 17,
    total: 387,
    estDelivery: "Delivered",
    status: "Delivered",
    date: new Date(Date.now() - 3 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  }
];

const seed = async () => {
  try {
    const mongoUri = process.env.CONNECTION_STRING || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("No MongoDB connection string found in process.env.CONNECTION_STRING or MONGO_URI");
    }

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB Atlas successfully!");

    const allFoods = loadAllFoods();
    console.log(`Loaded TOTAL ${allFoods.length} Food Dishes (8 Signature + 30 File Recipes + 120 Regional & World Dishes)`);

    // Reset and seed Users
    await User.deleteMany({});
    await User.insertMany(realisticUsers);
    console.log(`Inserted ${realisticUsers.length} Users successfully! (1 Admin + 2 Customers)`);

    // Reset and seed Recipes
    await Recipe.deleteMany({});
    await Recipe.insertMany(allFoods);
    console.log(`Inserted ${allFoods.length} Food Dishes into MongoDB Atlas!`);

    // Reset and seed Reviews
    await Review.deleteMany({});
    await Review.insertMany(realisticReviews);
    console.log(`Inserted ${realisticReviews.length} Authentic Customer Reviews!`);

    // Reset and seed Orders
    await Order.deleteMany({});
    await Order.insertMany(realisticOrders);
    console.log(`Inserted ${realisticOrders.length} Historical Orders (Delivered status verified)!`);

    console.log("=================================================");
    console.log("ALL DATA SEEDED SUCCESSFULLY TO MONGODB ATLAS!");
    console.log("=================================================");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seed();
