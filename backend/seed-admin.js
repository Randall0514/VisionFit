const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

async function seed() {
  const client = new MongoClient("mongodb://localhost:27017/visionfit");
  await client.connect();
  const db = client.db("visionfit");
  const users = db.collection("users");
  
  const existing = await users.findOne({ email: "admin@visionfit.com" });
  if (existing) {
    console.log("Admin user already exists");
    await client.close();
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);
  await users.insertOne({
    firstName: "Admin",
    lastName: "VisionFit",
    email: "admin@visionfit.com",
    password: hashedPassword,
    role: "admin",
    avatar: "",
    faceShape: "",
    prescription: { sphere: "", cylinder: "", axis: "", add: "" },
    createdAt: new Date(),
    updatedAt: new Date()
  });

  console.log("Admin user created: admin@visionfit.com / admin123");
  await client.close();
}

seed().catch(console.error);
