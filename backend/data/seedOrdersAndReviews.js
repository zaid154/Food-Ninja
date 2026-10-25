// Realistic Order History & 50+ Authentic Customer Reviews Dataset

const realisticReviews = [
  // 1. Hyderabadi Dum Biryani
  { recipeId: 1, userName: "Mohd Zaid", userEmail: "zaid@foodninja.com", rating: 5, comment: "The Hyderabadi Dum Biryani is absolutely top tier! The aroma of saffron and tender chicken melted in every bite. Truly royal taste!" },
  { recipeId: 1, userName: "Sara Khan", userEmail: "sara@foodninja.com", rating: 5, comment: "Piping hot delivery, long basmati grains, and generous pieces. The portion size in the Full plate easily serves two. Best biryani in town!" },
  { recipeId: 1, userName: "Kabir Malhotra", userEmail: "kabir.m@gmail.com", rating: 5, comment: "Authentic kachhi dum style! The chicken was so succulent and the raita + salan combination was spot on." },

  // 2. Paneer Butter Masala
  { recipeId: 2, userName: "Mohd Zaid", userEmail: "zaid@foodninja.com", rating: 5, comment: "Silky, velvety gravy with fresh, melt-in-the-mouth paneer cubes. The butter and kasuri methi aroma is unforgettable!" },
  { recipeId: 2, userName: "Priya Verma", userEmail: "priya.verma@gmail.com", rating: 5, comment: "Not too sweet, perfectly spiced tomato-cashew makhani gravy. Ordered the half plate and it was more than enough with garlic naan." },

  // 3. Farmhouse Cheese Burst Pizza
  { recipeId: 3, userName: "Sara Khan", userEmail: "sara@foodninja.com", rating: 5, comment: "Liquid cheese burst oozing from every slice! Fresh capsicum, mushrooms, and onion crunch was delightful." },
  { recipeId: 3, userName: "Aarav Sharma", userEmail: "aarav@gmail.com", rating: 4, comment: "Really great cheese quality and crispy wood-fired crust. Delivered hot within 25 minutes." },

  // 4. Crispy Chicken Zinger Burger
  { recipeId: 4, userName: "Rohan Kapoor", userEmail: "rohan.k@outlook.com", rating: 5, comment: "Super crunchy batter-fried chicken fillet with garlic mayo in toasted brioche. Better than big fast-food chains!" },
  { recipeId: 4, userName: "Tanya Chawla", userEmail: "tanya.c@gmail.com", rating: 4, comment: "Patty remained crispy until delivery. Loved the fresh lettuce and peppery punch." },

  // 5. Veg Hakka Noodles & Manchurian
  { recipeId: 5, userName: "Ananya Sen", userEmail: "ananya.sen@gmail.com", rating: 5, comment: "True Indo-Chinese wok hei flavor! Noodles had the perfect chew and the Manchurian balls were tender in spicy garlic gravy." },
  { recipeId: 5, userName: "Mohd Zaid", userEmail: "zaid@foodninja.com", rating: 4, comment: "Great balance of soya and green chili. Portion size in Full plate is very generous." },

  // 6. Double Egg Chicken Roll
  { recipeId: 6, userName: "Sneha Patel", userEmail: "sneha.p@gmail.com", rating: 5, comment: "Flaky lachha paratha layered with double egg and juicy spiced chicken cubes. The green mint chutney gave it a stellar kick!" },

  // 7. Steamed Chicken Momos
  { recipeId: 7, userName: "Farhan Qureshi", userEmail: "farhan.q@gmail.com", rating: 5, comment: "Thin translucent wrappers filled with juicy minced chicken and scallions. The spicy red dip is fire!" },

  // 8. Chocolate Belgian Thick Shake
  { recipeId: 8, userName: "Alia Siddiqui", userEmail: "alia.s@gmail.com", rating: 5, comment: "Decadent, rich dark Belgian cocoa blended to perfection. Thick enough to eat with a spoon!" },

  // 9. Amritsari Chole Bhature
  { recipeId: 9, userName: "Mohd Zaid", userEmail: "zaid@foodninja.com", rating: 5, comment: "Authentic Amritsari dark pindi chole with anardana tang, paired with huge fluffy bhature and sirka onions. Pure nostalgia!" },
  { recipeId: 9, userName: "Sara Khan", userEmail: "sara@foodninja.com", rating: 5, comment: "Sunday morning brunch done right! Non-greasy bhaturas and intensely flavorful spiced chole." },

  // 10. Murgh Makhani (Butter Chicken)
  { recipeId: 10, userName: "Mohd Zaid", userEmail: "zaid@foodninja.com", rating: 5, comment: "Old Delhi style charcoal-smoked tandoori chicken chunks simmered in pure butter and cream gravy. 10/10 masterclass!" },
  { recipeId: 10, userName: "Vikramaditya Rao", userEmail: "vikram.rao@gmail.com", rating: 5, comment: "Rich, luscious, and balanced. The subtle sweetness of cashews and fenugreek leaves is chef-grade." },
  { recipeId: 10, userName: "Priya Verma", userEmail: "priya.verma@gmail.com", rating: 4, comment: "Chicken was exceptionally soft and absorbed the makhani sauce completely. Arrived steaming hot." },

  // 11. Dal Makhani Charcoal Simmered
  { recipeId: 11, userName: "Sara Khan", userEmail: "sara@foodninja.com", rating: 5, comment: "Slow simmered over charcoal for hours. The deep creamy texture of black urad dal and white butter is unbeatable." },
  { recipeId: 11, userName: "Divya Nair", userEmail: "divya.n@gmail.com", rating: 5, comment: "Best dal makhani on any food app! Creamy, hearty, and authentic." },

  // 12. Sarson Ka Saag & Makki Di Roti
  { recipeId: 12, userName: "Harsh Vardhan", userEmail: "harsh.v@gmail.com", rating: 5, comment: "Traditional winter classic done right! Earthy mustard greens with generous white butter and crisp makki roti." },

  // 13. Tandoori Murgh (Half)
  { recipeId: 13, userName: "Aarav Sharma", userEmail: "aarav@gmail.com", rating: 5, comment: "Charcoal charred chicken with spicy yogurt marinade. Juicy on the inside and smoky on the outside." },

  // 14. Paneer Tikka (Charcoal Grilled)
  { recipeId: 14, userName: "Pooja Hegde", userEmail: "pooja.h@gmail.com", rating: 5, comment: "Large tender paneer blocks marinated in ajwain and mustard oil, roasted with crisp onions and capsicum." },

  // 15. Amritsari Fish Fry
  { recipeId: 15, userName: "Rohan Kapoor", userEmail: "rohan.k@outlook.com", rating: 5, comment: "Crisp carom-seed spiced gram flour batter around flaky fresh fish. Tangy chaat masala on top makes it addictive." },

  // 16. Kadai Paneer
  { recipeId: 16, userName: "Rahul Mehta", userEmail: "rahul.m@gmail.com", rating: 4, comment: "Crushed coriander seeds and dried red chilies in a spicy semi-dry gravy. Great crunch from bell peppers." },

  // 17. Rajma Chawal Platter
  { recipeId: 17, userName: "Simran Kaur", userEmail: "simran.k@gmail.com", rating: 5, comment: "Comfort food heaven! Slow-cooked Kashmiri rajma in thick onion-tomato masala served over jeera rice." },

  // 18. Chicken Tikka Masala
  { recipeId: 18, userName: "Kabir Malhotra", userEmail: "kabir.m@gmail.com", rating: 5, comment: "Smoky boneless tandoori chicken in an aromatic spicy gravy. Ordered the half plate and was thoroughly satisfied." },

  // 19. Shahi Malai Kofta
  { recipeId: 19, userName: "Meera Nambiar", userEmail: "meera.n@gmail.com", rating: 5, comment: "Melt-in-mouth cottage cheese and mawa dumplings in a luxurious white cashew gravy. Truly royal!" },

  // 20. Amritsari Aloo Kulcha
  { recipeId: 20, userName: "Deepak Joshi", userEmail: "deepak.j@gmail.com", rating: 5, comment: "Crisp layered kulcha stuffed with spiced potato and crushed pomegranate seeds. Served with spicy chole." },

  // 21. Lucknowi Galouti Kebab
  { recipeId: 21, userName: "Mohd Zaid", userEmail: "zaid@foodninja.com", rating: 5, comment: "Finely minced mutton with raw papaya tenderizer and 25 royal Awadhi spices. Melts on your tongue!" },

  // 22. Purani Dilli Nihari Gosht
  { recipeId: 22, userName: "Mohd Zaid", userEmail: "zaid@foodninja.com", rating: 5, comment: "Slow-braised overnight mutton shank in rich, velvety nihari gravy with ginger and green chilies. Pure Chandni Chowk authenticity!" },

  // 24. Awadhi Dum Murgh Biryani
  { recipeId: 24, userName: "Fatima Al-Zahra", userEmail: "fatima.z@gmail.com", rating: 5, comment: "Subtle, aromatic pakki dum biryani flavored with ittar and kewra water. Very gentle on the stomach and flavorful." },

  // 25. Shahi Tukda with Rabdi
  { recipeId: 25, userName: "Sara Khan", userEmail: "sara@foodninja.com", rating: 5, comment: "Crispy ghee-fried bread bathed in thick cardamom rabdi and chopped pistachios. Heavenly dessert!" },

  // 26. Moradabadi Moong Dal Chaat
  { recipeId: 26, userName: "Rohit Aggarwal", userEmail: "rohit.a@gmail.com", rating: 5, comment: "Hot steamed moong dal with melting butter, hing tadka, and crispy papdi. Unmatched winter evening snack!" },

  // 31. Rajasthani Dal Baati Churma
  { recipeId: 31, userName: "Mohd Zaid", userEmail: "zaid@foodninja.com", rating: 5, comment: "Desi ghee dripping baatis, spicy panchranga dal, and nutty sweet churma. Authentic Marwari taste delivered hot." },

  // 32. Royal Rajasthani Laal Maas
  { recipeId: 32, userName: "Arjun Singhal", userEmail: "arjun.s@gmail.com", rating: 5, comment: "Fiery Mathania red chili gravy cooked with mustard oil and tender mutton. Authentic royal heat and flavor!" },

  // 38. Kashmiri Mutton Rogan Josh
  { recipeId: 38, userName: "Karan Johar", userEmail: "karan.j@gmail.com", rating: 5, comment: "Aromatic Kashmiri chili color, fennel, and dried ginger notes in tender lamb curry. No onion or garlic, pure Wazwan style." },

  // 40. Kashmiri Gushtaba
  { recipeId: 40, userName: "Sara Khan", userEmail: "sara@foodninja.com", rating: 5, comment: "Pounded silky mutton meatballs poached in velvety yogurt yakhni with dried mint. Exceptional culinary craftsmanship." },

  // 54. Mumbai Butter Pav Bhaji
  { recipeId: 54, userName: "Sara Khan", userEmail: "sara@foodninja.com", rating: 5, comment: "Loaded with butter! Mashed spiced vegetables with chopped onions and lemon, served with butter-toasted pavs." },

  // 56. Kolhapuri Spicy Misal Pav
  { recipeId: 56, userName: "Amit Deshmukh", userEmail: "amit.d@gmail.com", rating: 5, comment: "Fiery red rassa (kat) with sprouted moth beans and farsan. Sweated through it and loved every bite!" },

  // 62. Goan Fish Curry with Steamed Rice
  { recipeId: 62, userName: "Ananya Sen", userEmail: "ananya.sen@gmail.com", rating: 5, comment: "Tangy coconut and kokum curry with fresh surmai fish fillet. Tasted just like beach shacks in Calangute." },

  // 66. Chettinad Pepper Chicken
  { recipeId: 66, userName: "Naveen Reddy", userEmail: "naveen.r@gmail.com", rating: 5, comment: "Bold, freshly roasted black pepper, curry leaves, and fennel. Tender chicken coated in dark spicy masala." },

  // 67. Crispy Masala Dosa
  { recipeId: 67, userName: "Mohd Zaid", userEmail: "zaid@foodninja.com", rating: 5, comment: "Paper-thin golden crisp dosa with fragrant mustard potato masala and fresh coconut chutney. 10/10 perfection!" },

  // 73. Malabar Chicken Dum Biryani
  { recipeId: 73, userName: "Divya Nair", userEmail: "divya.n@gmail.com", rating: 5, comment: "Short-grain kaima rice infused with pure ghee, cashews, and raisins. Kerala Malabar flavor at its best." },

  // 75. Alleppey Fish Curry with Coconut Milk
  { recipeId: 75, userName: "Priya Verma", userEmail: "priya.verma@gmail.com", rating: 5, comment: "Raw mango sourness and creamy coconut milk simmered with fresh fish. Extremely comforting." },

  // 80. Authentic Hyderabadi Mutton Haleem
  { recipeId: 80, userName: "Mohd Zaid", userEmail: "zaid@foodninja.com", rating: 5, comment: "Rich, sticky, slow-cooked mutton, wheat, lentils and desi ghee topped with fried onions and mint. Best Ramadan dish!" },

  // 91. Kolkata Mutton Biryani
  { recipeId: 91, userName: "Ananya Sen", userEmail: "ananya.sen@gmail.com", rating: 5, comment: "The soft spiced potato and boiled egg in light fragrant basmati rice was perfection. Mutton was fall-off-the-bone tender." },

  // 104. Classic Neapolitan Margherita Pizza
  { recipeId: 104, userName: "Kabir Malhotra", userEmail: "kabir.m@gmail.com", rating: 5, comment: "Airy bubbly cornicione crust with sweet San Marzano tomato puree and buffalo mozzarella. True Italian taste." },

  // 105. Creamy Fettuccine Alfredo
  { recipeId: 105, userName: "Tanya Chawla", userEmail: "tanya.c@gmail.com", rating: 5, comment: "Silky parmesan-butter emulsion coating tender ribbons of pasta. Comforting and delicious." },

  // 109. Chipotle Chicken Burrito Bowl
  { recipeId: 109, userName: "Rohan Kapoor", userEmail: "rohan.k@outlook.com", rating: 5, comment: "Fresh cilantro lime rice, smoky grilled chicken, black beans, sweet corn salsa, and fresh guacamole. High protein power meal!" },

  // 118. Thai Street Style Pad Thai Noodles
  { recipeId: 118, userName: "Sneha Patel", userEmail: "sneha.p@gmail.com", rating: 5, comment: "Chewy rice noodles in balanced sweet-sour tamarind sauce with crunchy peanuts, tofu, and fresh bean sprouts." },

  // 119. Thai Green Coconut Curry
  { recipeId: 119, userName: "Aarav Sharma", userEmail: "aarav@gmail.com", rating: 5, comment: "Lemongrass, kaffir lime and creamy coconut milk with tender chicken and jasmine rice. Wonderfully aromatic." },

  // 122. Chicken Shawarma Platter
  { recipeId: 122, userName: "Farhan Qureshi", userEmail: "farhan.q@gmail.com", rating: 5, comment: "Thinly sliced spit-roasted chicken with airy garlic toum, warm pita bread, and pickled turnips. Pure Middle Eastern bliss." },

  // 123. Crispy Falafel Hummus Platter
  { recipeId: 123, userName: "Sara Khan", userEmail: "sara@foodninja.com", rating: 5, comment: "Crispy herb-packed falafels with velvety tahini hummus and olive oil. Healthy, satisfying, and vegan." },

  // 128. New York Style Baked Cheesecake
  { recipeId: 128, userName: "Mohd Zaid", userEmail: "zaid@foodninja.com", rating: 5, comment: "Dense, rich cream cheese filling on buttery graham cracker crust. Best dessert finish to any meal!" }
];

const realisticOrders = [
  // Order 1001 - Delivered (Today, Mohd Zaid)
  {
    id: 1001, userEmail: "zaid@foodninja.com", customerName: "Mohd Zaid", phone: "9999201255", address: "B-13/2, Street No-07, Delhi NCR - 110094",
    payment: "UPI / Online Payment", paymentStatus: "Paid", paymentMethod: "UPI",
    items: [
      { id: 1, name: "Hyderabadi Dum Biryani", portionSize: "Full", price: 260, quantity: 1, isVeg: false, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80" },
      { id: 2, name: "Paneer Butter Masala", portionSize: "Half", price: 140, quantity: 1, isVeg: true, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80" }
    ],
    subtotal: 400, deliveryFee: 30, packagingFee: 15, taxes: 20, discount: 0, total: 465,
    estDelivery: "Delivered", status: "Delivered", date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  },
  // Order 1002 - Out for Delivery (Today, Sara Khan)
  {
    id: 1002, userEmail: "sara@foodninja.com", customerName: "Sara Khan", phone: "9876543210", address: "Flat 204, Lotus Heights, Indirapuram, Ghaziabad - 201014",
    payment: "Credit Card", paymentStatus: "Paid", paymentMethod: "Credit Card",
    items: [
      { id: 3, name: "Farmhouse Cheese Burst Pizza", portionSize: "Full", price: 320, quantity: 1, isVeg: true, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80" },
      { id: 8, name: "Chocolate Belgian Thick Shake", price: 140, quantity: 2, isVeg: true, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80" }
    ],
    subtotal: 600, deliveryFee: 0, packagingFee: 15, taxes: 30, discount: 50, total: 595,
    estDelivery: "20-25 mins", status: "Out for Delivery", date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  },
  // Order 1003 - Preparing (Today, Aarav Sharma)
  {
    id: 1003, userEmail: "aarav@gmail.com", customerName: "Aarav Sharma", phone: "9811223344", address: "House 42, Block C, Green Park, New Delhi - 110016",
    payment: "UPI / Online Payment", paymentStatus: "Paid", paymentMethod: "UPI",
    items: [
      { id: 10, name: "Murgh Makhani (Butter Chicken)", portionSize: "Full", price: 340, quantity: 1, isVeg: false, image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/Butter_Chicken_%26_Butter_Naan_-_Home_-_Chandigarh_-_India_-_0006.jpg/960px-Butter_Chicken_%26_Butter_Naan_-_Home_-_Chandigarh_-_India_-_0006.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail" },
      { id: 11, name: "Dal Makhani Charcoal Simmered", portionSize: "Half", price: 160, quantity: 1, isVeg: true, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80" }
    ],
    subtotal: 500, deliveryFee: 0, packagingFee: 15, taxes: 25, discount: 0, total: 540,
    estDelivery: "25-30 mins", status: "Preparing", date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  },
  // Order 1004 - Placed (Today, Priya Verma)
  {
    id: 1004, userEmail: "priya.verma@gmail.com", customerName: "Priya Verma", phone: "9871100223", address: "Tower B-502, Ace City, Sector 1, Greater Noida West - 201306",
    payment: "Cash on Delivery", paymentStatus: "Pending", paymentMethod: "Cash on Delivery",
    items: [
      { id: 5, name: "Veg Hakka Noodles & Manchurian", portionSize: "Half", price: 140, quantity: 1, isVeg: true, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80" },
      { id: 7, name: "Steamed Chicken Momos (8 Pcs)", price: 130, quantity: 1, isVeg: false, image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=800&auto=format&fit=crop&q=80" }
    ],
    subtotal: 270, deliveryFee: 30, packagingFee: 15, taxes: 14, discount: 0, total: 329,
    estDelivery: "30-35 mins", status: "Placed", date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  },
  // Order 1005 - Delivered (Yesterday, Mohd Zaid)
  {
    id: 1005, userEmail: "zaid@foodninja.com", customerName: "Mohd Zaid", phone: "9999201255", address: "B-13/2, Street No-07, Delhi NCR - 110094",
    payment: "UPI / Online Payment", paymentStatus: "Paid", paymentMethod: "UPI",
    items: [
      { id: 9, name: "Amritsari Chole Bhature", portionSize: "Full", price: 160, quantity: 2, isVeg: true, image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&auto=format&fit=crop&q=80" },
      { id: 6, name: "Double Egg Chicken Roll", portionSize: "Full", price: 150, quantity: 2, isVeg: false, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80" }
    ],
    subtotal: 620, deliveryFee: 0, packagingFee: 15, taxes: 31, discount: 50, total: 616,
    estDelivery: "Delivered", status: "Delivered", date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  },
  // Order 1006 - Delivered (Yesterday, Sara Khan)
  {
    id: 1006, userEmail: "sara@foodninja.com", customerName: "Sara Khan", phone: "9876543210", address: "Flat 204, Lotus Heights, Indirapuram, Ghaziabad - 201014",
    payment: "Cash on Delivery", paymentStatus: "Paid", paymentMethod: "Cash on Delivery",
    items: [
      { id: 54, name: "Mumbai Butter Pav Bhaji", portionSize: "Full", price: 170, quantity: 2, isVeg: true, image: "https://images.unsplash.com/photo-1606471191009-63994c53433b?w=800&auto=format&fit=crop&q=80" },
      { id: 25, name: "Shahi Tukda with Rabdi", price: 140, quantity: 2, isVeg: true, image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&auto=format&fit=crop&q=80" }
    ],
    subtotal: 620, deliveryFee: 0, packagingFee: 15, taxes: 31, discount: 0, total: 666,
    estDelivery: "Delivered", status: "Delivered", date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  },
  // Order 1007 - Delivered (2 Days Ago, Rohan Kapoor)
  {
    id: 1007, userEmail: "rohan.k@outlook.com", customerName: "Rohan Kapoor", phone: "9955443322", address: "Villa 18, Palm Meadows, Whitefield, Bangalore - 560066",
    payment: "Credit Card", paymentStatus: "Paid", paymentMethod: "Credit Card",
    items: [
      { id: 4, name: "Crispy Chicken Zinger Burger", price: 180, quantity: 2, isVeg: false, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80" },
      { id: 109, name: "Chipotle Chicken Burrito Bowl", portionSize: "Full", price: 290, quantity: 1, isVeg: false, image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&auto=format&fit=crop&q=80" }
    ],
    subtotal: 650, deliveryFee: 0, packagingFee: 15, taxes: 33, discount: 0, total: 698,
    estDelivery: "Delivered", status: "Delivered", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  },
  // Order 1008 - Delivered (3 Days Ago, Ananya Sen)
  {
    id: 1008, userEmail: "ananya.sen@gmail.com", customerName: "Ananya Sen", phone: "9833445566", address: "7A, Southern Avenue, Lake Market, Kolkata - 700029",
    payment: "UPI / Online Payment", paymentStatus: "Paid", paymentMethod: "UPI",
    items: [
      { id: 91, name: "Kolkata Mutton Biryani (with Aloo & Egg)", portionSize: "Full", price: 340, quantity: 1, isVeg: false, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80" },
      { id: 62, name: "Goan Fish Curry with Steamed Rice", portionSize: "Half", price: 210, quantity: 1, isVeg: false, image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80" }
    ],
    subtotal: 550, deliveryFee: 0, packagingFee: 15, taxes: 28, discount: 0, total: 593,
    estDelivery: "Delivered", status: "Delivered", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  },
  // Order 1009 - Delivered (4 Days Ago, Mohd Zaid)
  {
    id: 1009, userEmail: "zaid@foodninja.com", customerName: "Mohd Zaid", phone: "9999201255", address: "B-13/2, Street No-07, Delhi NCR - 110094",
    payment: "UPI / Online Payment", paymentStatus: "Paid", paymentMethod: "UPI",
    items: [
      { id: 22, name: "Purani Dilli Nihari Gosht", portionSize: "Full", price: 390, quantity: 1, isVeg: false, image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=800&auto=format&fit=crop&q=80" },
      { id: 21, name: "Lucknowi Galouti Kebab (4 Pcs)", portionSize: "Full", price: 290, quantity: 1, isVeg: false, image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80" }
    ],
    subtotal: 680, deliveryFee: 0, packagingFee: 15, taxes: 34, discount: 50, total: 679,
    estDelivery: "Delivered", status: "Delivered", date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  },
  // Order 1010 - Delivered (5 Days Ago, Kabir Malhotra)
  {
    id: 1010, userEmail: "kabir.m@gmail.com", customerName: "Kabir Malhotra", phone: "9822334455", address: "D-802, Pinnacle Tower, Golf Course Road, Gurgaon - 122002",
    payment: "Credit Card", paymentStatus: "Paid", paymentMethod: "Credit Card",
    items: [
      { id: 104, name: "Classic Neapolitan Margherita Pizza", portionSize: "Full", price: 320, quantity: 1, isVeg: true, image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Neapolitan_pizza_at_Trappica_%2848701940197%29.jpg/960px-Neapolitan_pizza_at_Trappica_%2848701940197%29.jpg" },
      { id: 18, name: "Chicken Tikka Masala", portionSize: "Half", price: 200, quantity: 1, isVeg: false, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80" }
    ],
    subtotal: 520, deliveryFee: 0, packagingFee: 15, taxes: 26, discount: 0, total: 561,
    estDelivery: "Delivered", status: "Delivered", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  },
  // Order 1011 - Delivered (6 Days Ago, Sara Khan)
  {
    id: 1011, userEmail: "sara@foodninja.com", customerName: "Sara Khan", phone: "9876543210", address: "Flat 204, Lotus Heights, Indirapuram, Ghaziabad - 201014",
    payment: "Cash on Delivery", paymentStatus: "Paid", paymentMethod: "Cash on Delivery",
    items: [
      { id: 123, name: "Crispy Falafel Hummus Platter with Pickles", portionSize: "Full", price: 230, quantity: 1, isVeg: true, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80" },
      { id: 40, name: "Kashmiri Gushtaba (Wazwan Special)", portionSize: "Half", price: 280, quantity: 1, isVeg: false, image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/Gushtaba.JPG/960px-Gushtaba.JPG" }
    ],
    subtotal: 510, deliveryFee: 0, packagingFee: 15, taxes: 26, discount: 0, total: 551,
    estDelivery: "Delivered", status: "Delivered", date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  },
  // Order 1012 - Delivered (7 Days Ago, Mohd Zaid)
  {
    id: 1012, userEmail: "zaid@foodninja.com", customerName: "Mohd Zaid", phone: "9999201255", address: "B-13/2, Street No-07, Delhi NCR - 110094",
    payment: "UPI / Online Payment", paymentStatus: "Paid", paymentMethod: "UPI",
    items: [
      { id: 31, name: "Rajasthani Dal Baati Churma", portionSize: "Full", price: 260, quantity: 1, isVeg: true, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80" },
      { id: 80, name: "Authentic Hyderabadi Mutton Haleem", portionSize: "Half", price: 220, quantity: 1, isVeg: false, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80" }
    ],
    subtotal: 480, deliveryFee: 30, packagingFee: 15, taxes: 24, discount: 0, total: 549,
    estDelivery: "Delivered", status: "Delivered", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  },
  // Order 1013 - Delivered (8 Days Ago, Priya Verma)
  {
    id: 1013, userEmail: "priya.verma@gmail.com", customerName: "Priya Verma", phone: "9871100223", address: "Tower B-502, Ace City, Sector 1, Greater Noida West - 201306",
    payment: "UPI / Online Payment", paymentStatus: "Paid", paymentMethod: "UPI",
    items: [
      { id: 75, name: "Alleppey Fish Curry with Coconut Milk", portionSize: "Full", price: 340, quantity: 1, isVeg: false, image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80" },
      { id: 67, name: "Crispy Masala Dosa", price: 140, quantity: 1, isVeg: true, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80" }
    ],
    subtotal: 480, deliveryFee: 30, packagingFee: 15, taxes: 24, discount: 0, total: 549,
    estDelivery: "Delivered", status: "Delivered", date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  },
  // Order 1014 - Delivered (9 Days Ago, Farhan Qureshi)
  {
    id: 1014, userEmail: "farhan.q@gmail.com", customerName: "Farhan Qureshi", phone: "9899112233", address: "G-14, Okhla Vihar, Jamia Nagar, New Delhi - 110025",
    payment: "Cash on Delivery", paymentStatus: "Paid", paymentMethod: "Cash on Delivery",
    items: [
      { id: 122, name: "Chicken Shawarma Platter with Garlic Toum & Pita", portionSize: "Full", price: 270, quantity: 2, isVeg: false, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80" }
    ],
    subtotal: 540, deliveryFee: 0, packagingFee: 15, taxes: 27, discount: 0, total: 582,
    estDelivery: "Delivered", status: "Delivered", date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  },
  // Order 1015 - Delivered (10 Days Ago, Sneha Patel)
  {
    id: 1015, userEmail: "sneha.p@gmail.com", customerName: "Sneha Patel", phone: "9819922883", address: "Flat 402, Sai Kripa Society, Andheri West, Mumbai - 400058",
    payment: "Credit Card", paymentStatus: "Paid", paymentMethod: "Credit Card",
    items: [
      { id: 118, name: "Thai Street Style Pad Thai Noodles", portionSize: "Full", price: 270, quantity: 1, isVeg: false, image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&auto=format&fit=crop&q=80" },
      { id: 119, name: "Thai Green Coconut Curry with Jasmine Rice", portionSize: "Half", price: 200, quantity: 1, isVeg: false, image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&auto=format&fit=crop&q=80" }
    ],
    subtotal: 470, deliveryFee: 30, packagingFee: 15, taxes: 24, discount: 0, total: 539,
    estDelivery: "Delivered", status: "Delivered", date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  },
  // Order 1016 - Delivered (11 Days Ago, Mohd Zaid)
  {
    id: 1016, userEmail: "zaid@foodninja.com", customerName: "Mohd Zaid", phone: "9999201255", address: "B-13/2, Street No-07, Delhi NCR - 110094",
    payment: "UPI / Online Payment", paymentStatus: "Paid", paymentMethod: "UPI",
    items: [
      { id: 67, name: "Crispy Masala Dosa", price: 140, quantity: 2, isVeg: true, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80" },
      { id: 128, name: "New York Style Baked Cheesecake", price: 220, quantity: 1, isVeg: true, image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80" }
    ],
    subtotal: 500, deliveryFee: 0, packagingFee: 15, taxes: 25, discount: 0, total: 540,
    estDelivery: "Delivered", status: "Delivered", date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  },
  // Order 1017 - Delivered (12 Days Ago, Aarav Sharma)
  {
    id: 1017, userEmail: "aarav@gmail.com", customerName: "Aarav Sharma", phone: "9811223344", address: "House 42, Block C, Green Park, New Delhi - 110016",
    payment: "UPI / Online Payment", paymentStatus: "Paid", paymentMethod: "UPI",
    items: [
      { id: 13, name: "Tandoori Murgh (Half)", portionSize: "Half", price: 310, quantity: 1, isVeg: false, image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80" },
      { id: 11, name: "Dal Makhani Charcoal Simmered", portionSize: "Quarter", price: 100, quantity: 1, isVeg: true, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80" }
    ],
    subtotal: 410, deliveryFee: 30, packagingFee: 15, taxes: 21, discount: 0, total: 476,
    estDelivery: "Delivered", status: "Delivered", date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  },
  // Order 1018 - Delivered (13 Days Ago, Sara Khan)
  {
    id: 1018, userEmail: "sara@foodninja.com", customerName: "Sara Khan", phone: "9876543210", address: "Flat 204, Lotus Heights, Indirapuram, Ghaziabad - 201014",
    payment: "Credit Card", paymentStatus: "Paid", paymentMethod: "Credit Card",
    items: [
      { id: 1, name: "Hyderabadi Dum Biryani", portionSize: "Quarter", price: 110, quantity: 1, isVeg: false, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80" },
      { id: 2, name: "Paneer Butter Masala", portionSize: "Quarter", price: 90, quantity: 1, isVeg: true, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80" },
      { id: 8, name: "Chocolate Belgian Thick Shake", price: 140, quantity: 1, isVeg: true, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80" }
    ],
    subtotal: 340, deliveryFee: 30, packagingFee: 15, taxes: 17, discount: 0, total: 402,
    estDelivery: "Delivered", status: "Delivered", date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  }
];

module.exports = { realisticReviews, realisticOrders };
