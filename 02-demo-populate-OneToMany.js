const { connexion, deconnexion } = require("./connexion");
const mongoose = require("mongoose");

async function main() {
  await connexion();
  console.log("Wiping database before demo...");
  await mongoose.connection.db.dropDatabase();
  console.log("Wiped...");

  /* SCHEMA AND MODELS */
  const SuperPower = mongoose.model(
    "SuperPower",
    mongoose.Schema({ description: String })
  );
  const SuperHeroSchema = mongoose.Schema({
    name: String,
    superPowers: [
      {
        superPower: {
          type: mongoose.ObjectId,
          ref: "SuperPower",
        },
        level: Number,
      },
    ],
  });
  const SuperHero = mongoose.model("SuperHero", SuperHeroSchema);

  /* DEMO */
  const canFly = await SuperPower.create({ description: "Can Fly" });
  const theForce = await SuperPower.create({
    description: "May The Force Be With You",
  });
  const megaPunch = await SuperPower.create({
    description: "Punch Hits Like A Truck",
  });
  await SuperHero.create({
    name: "Superman",
    superPowers: [
      { superPower: canFly._id, level: 10 },
      { superPower: megaPunch._id, level: 10 },
    ],
  });

  await SuperHero.create({
    name: "Yoda",
    superPowers: [
      { superPower: canFly._id, level: 3 },
      { superPower: theForce._id, level: 10 },
    ],
  });

  const doc1 = await SuperHero.findOne();
  console.log("\nDocument sans populate()");
  console.log(doc1);
  console.log(doc1.superPowers);

  const doc2 = await SuperHero.findOne().populate("superPowers.superPower");
  console.log("\nDocument avec populate()");
  console.log(
    "Le document affiche un placeholder pour ne pas encombrer la console..."
  );
  console.log(doc2);
  console.log(
    "Mais on peut observer que le populate a fonctionné en affichant l'array directement."
  );
  console.log(doc2.superPowers);

  // alternative:
  // const doc2 = await Person.findOne();
  // console.log('\nDocument avec populate()');
  // console.log(await doc2.populate('group'));

  await deconnexion();
}

main();
