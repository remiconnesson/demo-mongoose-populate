const { connexion, deconnexion } = require("./connexion");
const mongoose = require("mongoose");

async function main() {
  await connexion();
  console.log("Wiping database before demo...");
  await mongoose.connection.db.dropDatabase();
  console.log("Wiped...");

  /* MODELS & SCHEMAS */
  const SuperPower = mongoose.model(
    "SuperPower",
    mongoose.Schema({ description: String })
  );
  const SuperHeroSchema = mongoose.Schema({
    name: String,
    superPower: {
      type: mongoose.ObjectId,
      ref: "SuperPower",
    },
  });
  const SuperHero = mongoose.model("SuperHero", SuperHeroSchema);

  /* DEMO */
  const canFly = await SuperPower.create({ description: "Can Fly" });
  await SuperHero.create({ name: "Superman", superPower: canFly._id });

  const doc1 = await SuperHero.findOne();
  console.log("\nDocument sans populate()");
  console.log(doc1);

  const doc2 = await SuperHero.findOne().populate("superPower");
  console.log("\nDocument avec populate()");
  console.log(doc2);

  // alternative:
  // const doc2 = await Person.findOne();
  // console.log('\nDocument avec populate()');
  // console.log(await doc2.populate('group'));

  await deconnexion();
}

main();
