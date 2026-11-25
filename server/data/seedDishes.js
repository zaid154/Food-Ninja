// Aggregated 120 Authentic Dishes Dataset
const dishesNorth = require("./dishesNorth");
const dishesSouthEastWest = require("./dishesSouthEastWest");
const dishesWorld = require("./dishesWorld");

const seedDishes = [
  ...dishesNorth,
  ...dishesSouthEastWest,
  ...dishesWorld
];

module.exports = seedDishes;
