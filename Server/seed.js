require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./src/models/productModels");

const seedProducts = [
  {
    title: "The Chronograph Eclipse",
    description: "A masterclass in horology. The Chronograph Eclipse features a meticulously crafted dial, a perpetual calendar, and an in-house movement that guarantees precision. Encased in platinum and paired with a bespoke alligator leather strap, it is the definition of timeless elegance.",
    price: 4500.00,
    category: "Timepieces",
    stock: 12,
    images: [
      { public_id: "mock-watch-1", url: "http://localhost:3000/api/images/product-watch" },
      { public_id: "mock-watch-2", url: "http://localhost:3000/api/images/watch-angle-side" },
      { public_id: "mock-watch-3", url: "http://localhost:3000/api/images/watch-angle-dial" }
    ],
    materials: ["Platinum Case", "Sapphire Crystal", "Alligator Leather"],
    variants: []
  },
  {
    title: "Lumière Eau de Parfum",
    description: "An intoxicating blend of rare midnight jasmine, warm amber, and subtle hints of bergamot. Lumière is designed for the modern romantic, leaving a lingering, unforgettable trail wherever you go.",
    price: 285.00,
    category: "Fragrances",
    stock: 45,
    images: [
      { public_id: "mock-perf-1", url: "http://localhost:3000/api/images/product-perfume" }
    ],
    materials: [],
    variants: [
      { name: "Volume", options: ["50ml", "100ml", "150ml"] }
    ]
  },
  {
    title: "Solstice Aviators",
    description: "Redefining the classic silhouette, the Solstice Aviators feature 18k gold-plated frames and polarized gradient lenses. Lightweight yet incredibly durable, they provide ultimate UV protection with undeniable style.",
    price: 420.00,
    category: "Accessories",
    stock: 8,
    images: [
      { public_id: "mock-sung-1", url: "http://localhost:3000/api/images/product-sunglasses" }
    ],
    materials: ["18k Gold Plated", "Polarized Lenses"],
    variants: []
  },
  {
    title: "Classic Bifold Wallet",
    description: "Handcrafted in Italy from full-grain calfskin, this classic bifold opens to reveal six card slots and dual bill compartments. The minimalist exterior is accented only by a discreet blind-embossed logo.",
    price: 350.00,
    category: "Leather Goods",
    stock: 0,
    images: [
      { public_id: "mock-wall-1", url: "http://localhost:3000/api/images/product-wallet" }
    ],
    materials: ["Full-grain Calfskin Leather"],
    variants: [
      { name: "Color", options: ["Noir", "Cognac", "Forest Green"] }
    ]
  },
  {
    title: "The Noir Tote",
    description: "The ultimate everyday luxury companion. Crafted from beautifully textured pebble leather, this spacious tote fits a 15-inch laptop and features solid brass hardware and an interior zip pocket for valuables.",
    price: 1850.00,
    category: "Leather Goods",
    stock: 24,
    images: [
      { public_id: "mock-tote-1", url: "http://localhost:3000/api/images/product-bag-black" }
    ],
    materials: ["Pebble Leather", "Solid Brass Hardware"],
    variants: []
  },
  {
    title: "Eternity Diamond Pendant",
    description: "Suspended on an 18k white gold chain, this breathtaking 2-carat solitaire diamond pendant catches the light from every angle. Certified conflict-free and flawlessly cut.",
    price: 8900.00,
    category: "Jewelry",
    stock: 3,
    images: [
      { public_id: "mock-pend-1", url: "http://localhost:3000/api/images/product-necklace" }
    ],
    materials: ["18k White Gold", "2-Carat VVS1 Diamond"],
    variants: []
  },
  {
    title: "Oud & Bergamot Cologne",
    description: "A rich, woody fragrance that commands attention. Smoky oud wood is perfectly balanced with crisp bergamot and cracked black pepper to create a deeply masculine and sophisticated scent profile.",
    price: 320.00,
    category: "Fragrances",
    stock: 18,
    images: [
      { public_id: "mock-col-1", url: "http://localhost:3000/api/images/product-cologne" }
    ],
    materials: [],
    variants: [
      { name: "Volume", options: ["100ml"] }
    ]
  },
  {
    title: "Platinum Solitaire Ring",
    description: "The symbol of a lifetime. A brilliant-cut center diamond is elegantly set in a custom-forged platinum band. Timeless, pure, and absolutely mesmerizing.",
    price: 12500.00,
    category: "Jewelry",
    stock: 2,
    images: [
      { public_id: "mock-ring-1", url: "http://localhost:3000/api/images/product-ring" }
    ],
    materials: ["Platinum 950", "3-Carat Diamond"],
    variants: [
      { name: "Ring Size", options: ["5", "6", "7", "8", "9"] }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    await Product.deleteMany(); // Clear existing products
    console.log("Cleared existing products...");

    await Product.insertMany(seedProducts);
    console.log("Successfully seeded 8 luxury products into the database!");

    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
