const { connexion, deconnexion } = require("./connexion");
const mongoose = require("mongoose");

async function main() {
  await connexion();
  console.log("Wiping database before demo...");
  await mongoose.connection.db.dropDatabase();
  console.log("Wiped...");

  /* SCHEMAS AND MODELS */
  const Follow = mongoose.model(
    "Follow",
    mongoose.Schema({
      follower: { type: mongoose.ObjectId, ref: "User" },
      followee: { type: mongoose.ObjectId, ref: "User" },
    })
  );
  const userSchema = mongoose.Schema({ name: String });

  userSchema.virtual("followers", {
    ref: "Follow",
    localField: "_id",
    foreignField: "followee",
  });

  const User = mongoose.model("User", userSchema);

  /* DEMO */
  const user1 = await User.create({ name: "Alice Bob" });
  const user2 = await User.create({ name: "Charlie Django" });
  const user3 = await User.create({ name: "Eric Fowler" });
  await Follow.create({ follower: user2, followee: user1 });
  await Follow.create({ follower: user3, followee: user1 });

  const opts = { path: "followers", populate: { path: "follower" } };
  let doc = await User.findOne({ name: /Alice/ }).populate(opts);
  console.log(doc);
  console.log(doc.followers);
  await deconnexion();
}

main();
