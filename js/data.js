// js/data.js — Product catalog (hardcoded, no fetch required)
// Images: Electronics + Clothing have unique per-product AI images.
// Home / Books / Sports use category placeholders until quota resets —
// paths are already individual (h1.jpg … s4.jpg) so swapping requires no code change.
window.PRODUCTS = [
  // Electronics (4)
  {
    id: "e1",
    name: "ProSound Headphones",
    category: "Electronics",
    price: 149.99,
    description: "Studio-quality wireless headphones with 40-hour battery and noise cancellation.",
    image: "images/e1.jpg",
    rating: 4.8,
    inStock: true
  },
  {
    id: "e2",
    name: "NovaSpark Smartphone",
    category: "Electronics",
    price: 899.00,
    description: "Flagship 6.7\" OLED display, 200MP camera, and all-day battery life.",
    image: "images/e2.jpg",
    rating: 4.7,
    inStock: true
  },
  {
    id: "e3",
    name: "SlimBook Pro Laptop",
    category: "Electronics",
    price: 1299.00,
    description: "Ultra-thin 14\" laptop, 32GB RAM, 1TB SSD, 18-hour battery.",
    image: "images/e3.jpg",
    rating: 4.9,
    inStock: false
  },
  {
    id: "e4",
    name: "PixelWatch Ultra",
    category: "Electronics",
    price: 349.00,
    description: "Smartwatch with health sensors, GPS, and 7-day battery life.",
    image: "images/e4.jpg",
    rating: 4.5,
    inStock: true
  },

  // Clothing (4)
  {
    id: "c1",
    name: "Merino Wool Crewneck",
    category: "Clothing",
    price: 89.00,
    description: "Soft 100% merino wool sweater, perfect for layering year-round.",
    image: "images/c1.jpg",
    rating: 4.6,
    inStock: true
  },
  {
    id: "c2",
    name: "AeroFlex Sneakers",
    category: "Clothing",
    price: 119.00,
    description: "Lightweight everyday runners with responsive cushioning.",
    image: "images/c2.jpg",
    rating: 4.7,
    inStock: true
  },
  {
    id: "c3",
    name: "Heritage Denim Jacket",
    category: "Clothing",
    price: 139.00,
    description: "Classic stonewashed denim jacket with a modern slim fit.",
    image: "images/c3.jpg",
    rating: 4.4,
    inStock: true
  },
  {
    id: "c4",
    name: "Silk Blend Scarf",
    category: "Clothing",
    price: 55.00,
    description: "Lightweight silk-modal blend scarf in timeless neutral tones.",
    image: "images/c4.jpg",
    rating: 4.3,
    inStock: false
  },

  // Home (4) — individual paths ready; images pending quota reset
  {
    id: "h1",
    name: "Nordic Ceramic Vase",
    category: "Home",
    price: 45.00,
    description: "Hand-thrown stoneware vase with a matte frost glaze.",
    image: "images/h1.jpg",
    rating: 4.8,
    inStock: true
  },
  {
    id: "h2",
    name: "Amber Soy Candle Set",
    category: "Home",
    price: 38.00,
    description: "Set of 3 hand-poured soy candles: cedar, vanilla, and sea salt.",
    image: "images/h2.jpg",
    rating: 4.9,
    inStock: true
  },
  {
    id: "h3",
    name: "Linen Throw Blanket",
    category: "Home",
    price: 75.00,
    description: "Pre-washed pure linen throw — gets softer with every wash.",
    image: "images/h3.jpg",
    rating: 4.6,
    inStock: true
  },
  {
    id: "h4",
    name: "Walnut Serving Board",
    category: "Home",
    price: 62.00,
    description: "End-grain walnut cutting and serving board, food-safe oil finish.",
    image: "images/h4.jpg",
    rating: 4.7,
    inStock: false
  },

  // Books (4)
  {
    id: "b1",
    name: "The Design of Everyday Things",
    category: "Books",
    price: 22.00,
    description: "Don Norman's classic on user-centered design and cognitive psychology.",
    image: "images/b1.jpg",
    rating: 4.9,
    inStock: true
  },
  {
    id: "b2",
    name: "Thinking, Fast and Slow",
    category: "Books",
    price: 18.00,
    description: "Daniel Kahneman explores the two systems that drive the way we think.",
    image: "images/b2.jpg",
    rating: 4.8,
    inStock: true
  },
  {
    id: "b3",
    name: "Atomic Habits",
    category: "Books",
    price: 16.00,
    description: "James Clear's proven framework for building good habits and breaking bad ones.",
    image: "images/b3.jpg",
    rating: 4.9,
    inStock: true
  },
  {
    id: "b4",
    name: "Sapiens",
    category: "Books",
    price: 19.00,
    description: "Yuval Noah Harari traces the history of humankind from ancient times to the present.",
    image: "images/b4.jpg",
    rating: 4.7,
    inStock: true
  },

  // Sports (4)
  {
    id: "s1",
    name: "TrailPro Running Shoes",
    category: "Sports",
    price: 129.00,
    description: "All-terrain trail runners with aggressive grip and breathable mesh upper.",
    image: "images/s1.jpg",
    rating: 4.7,
    inStock: true
  },
  {
    id: "s2",
    name: "HydroCore Water Bottle",
    category: "Sports",
    price: 35.00,
    description: "32oz insulated stainless steel bottle — stays cold 24h, hot 12h.",
    image: "images/s2.jpg",
    rating: 4.8,
    inStock: true
  },
  {
    id: "s3",
    name: "FlexBand Resistance Set",
    category: "Sports",
    price: 28.00,
    description: "Set of 5 latex resistance bands, 10–50 lbs, with carry bag.",
    image: "images/s3.jpg",
    rating: 4.6,
    inStock: true
  },
  {
    id: "s4",
    name: "ZenFlow Yoga Mat",
    category: "Sports",
    price: 68.00,
    description: "6mm non-slip natural rubber mat with alignment marks and carry strap.",
    image: "images/s4.jpg",
    rating: 4.9,
    inStock: false
  }
];
