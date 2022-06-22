const { connexion, deconnexion } = require("./connexion");
const mongoose = require("mongoose");

async function main() {
  await connexion();
  console.log("Wiping database before demo...");
  await mongoose.connection.db.dropDatabase();
  console.log("Wiped...");

  // One-to-many relationships: Order - Product, Product - Category
  const Order = mongoose.model(
    "Order",
    mongoose.Schema({
      products: [{ type: mongoose.ObjectId, ref: "Product" }],
    })
  );
  const Product = mongoose.model(
    "Product",
    mongoose.Schema({
      name: String,
      categories: [{ type: mongoose.ObjectId, ref: "Category" }],
    })
  );
  const categorySchema = mongoose.Schema({ name: String });
  const Category = mongoose.model("Category", categorySchema);

  // Create sample documents
  const phones = await Category.create({ name: "Phones" });
  const books = await Category.create({ name: "Books" });
  const [iphone, book] = await Product.create([
    { name: "iPhone", categories: [phones] },
    { name: "Harry Potter", categories: [books] },
  ]);
  await Order.create({ products: [iphone, book] });
  await Order.create({ products: [book] });

  // Deep populate
  const orders = await Order.find().populate({
    path: "products",
    // populate ce qui a été populate.
    populate: { path: "categories" },
  });

  console.log(orders[0]); // 'Phones'
  console.log(JSON.stringify(orders[0].toObject())); // 'Phones'

  await deconnexion();
}

main();
