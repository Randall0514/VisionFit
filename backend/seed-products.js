const { MongoClient } = require("mongodb");

async function seed() {
  const client = new MongoClient("mongodb://localhost:27017/visionfit");
  await client.connect();
  const db = client.db("visionfit");
  const products = db.collection("products");
  
  const count = await products.countDocuments();
  if (count > 0) {
    console.log("Products already exist (" + count + " products)");
    await client.close();
    return;
  }

  const sample = [
    {
      name: "The Olive", price: 2490, description: "A gentle square silhouette with a slim, lightweight profile. Premium acetate frame.", category: "eyeglass", frameShape: "square",
      colors: [{ name: "Olive", hex: "#667A4E" }, { name: "Tortoise", hex: "#70503B" }, { name: "Black", hex: "#26302B" }],
      compatibleLenses: ["single vision", "blue-light"], faceShapes: ["oval", "round"], image: "", inStock: true, createdAt: new Date(), updatedAt: new Date()
    },
    {
      name: "The Maple", price: 2190, description: "Classic round frames with a vintage feel. Hand-polished acetate.", category: "eyeglass", frameShape: "round",
      colors: [{ name: "Burgundy", hex: "#722F37" }, { name: "Honey", hex: "#C4A265" }],
      compatibleLenses: ["single vision", "progressive"], faceShapes: ["square", "heart"], image: "", inStock: true, createdAt: new Date(), updatedAt: new Date()
    },
    {
      name: "The Dusk", price: 3290, description: "Cat-eye frames with a bold, fashion-forward edge. Lightweight titanium.", category: "sunglasses", frameShape: "cat-eye",
      colors: [{ name: "Rose Gold", hex: "#B76E79" }, { name: "Matte Black", hex: "#28282B" }],
      compatibleLenses: ["photochromic", "single vision"], faceShapes: ["heart", "oval"], image: "", inStock: true, createdAt: new Date(), updatedAt: new Date()
    },
    {
      name: "The Horizon", price: 2790, description: "Browline frames with a scholarly, refined look. Mixed materials.", category: "eyeglass", frameShape: "browline",
      colors: [{ name: "Navy", hex: "#1B3A5C" }, { name: "Grey", hex: "#808080" }],
      compatibleLenses: ["single vision", "blue-light", "progressive"], faceShapes: ["round", "oval", "square"], image: "", inStock: true, createdAt: new Date(), updatedAt: new Date()
    },
    {
      name: "The Aviator Pro", price: 3490, description: "Classic aviator shape with polarized lenses. Metal frame with silicone nose pads.", category: "sunglasses", frameShape: "aviator",
      colors: [{ name: "Gold", hex: "#C9B037" }, { name: "Silver", hex: "#A8A9AD" }],
      compatibleLenses: ["single vision"], faceShapes: ["oval", "diamond"], image: "", inStock: true, createdAt: new Date(), updatedAt: new Date()
    },
    {
      name: "The Blue Shield", price: 1990, description: "Blue light blocking glasses for screen time. Modern rectangle frame.", category: "blue light", frameShape: "rectangle",
      colors: [{ name: "Clear", hex: "#E8E8E8" }, { name: "Black", hex: "#111111" }],
      compatibleLenses: ["blue-light"], faceShapes: ["round", "heart", "oval"], image: "", inStock: true, createdAt: new Date(), updatedAt: new Date()
    },
    {
      name: "The Sport X", price: 2990, description: "Wraparound sports frames with impact-resistant lenses. Rubber grip temples.", category: "sports", frameShape: "rectangle",
      colors: [{ name: "Red", hex: "#C41E3A" }, { name: "Blue", hex: "#1E3A8A" }],
      compatibleLenses: ["single vision", "thin lens"], faceShapes: ["square", "round"], image: "", inStock: true, createdAt: new Date(), updatedAt: new Date()
    },
    {
      name: "The Everyday", price: 1790, description: "Transitions lenses that adapt to light conditions. Comfortable all-day wear.", category: "transitions", frameShape: "round",
      colors: [{ name: "Charcoal", hex: "#36454F" }, { name: "Tortoise", hex: "#8B5A2B" }],
      compatibleLenses: ["photochromic", "single vision"], faceShapes: ["oval", "square", "heart"], image: "", inStock: true, createdAt: new Date(), updatedAt: new Date()
    }
  ];

  await products.insertMany(sample);
  console.log("Seeded " + sample.length + " sample products");
  await client.close();
}

seed().catch(console.error);
