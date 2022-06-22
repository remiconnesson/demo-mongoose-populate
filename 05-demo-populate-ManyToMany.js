const { connexion, deconnexion } = require("./connexion");
const mongoose = require("mongoose");

async function main() {
  await connexion();
  console.log("Wiping database before demo...");
  await mongoose.connection.db.dropDatabase();
  console.log("Wiped...");

  /* SCHEMAS AND MODELS */
  const Group = mongoose.model(
    "Group",
    mongoose.Schema({
      name: String,
      members: [{ type: mongoose.ObjectId, ref: "Person" }],
    })
  );
  const personSchema = mongoose.Schema({ name: String });
  personSchema.virtual("groups", {
    ref: "Group",
    localField: "_id",
    // `populate()` is smart enough to drill into `foreignField` if
    // `foreignField` is an array
    foreignField: "members",
  });
  const Person = mongoose.model("Person", personSchema);

  /* DEMO */
  const alice = await Person.create({ name: "Alice Charlie" });
  const bob = await Person.create({ name: "Bob Delta" });

  await Group.create({ name: "Club de Lecture", members: [alice] });
  await Group.create({ name: "Club de Voyage", members: [alice, bob] });
  const group = await Group.findOne({ name: "Club de Voyage" }).populate(
    "members"
  );

  console.log(group);

  const doc = await Person.findOne({ name: /Alice/ }).populate({
    path: "groups",
    options: { sort: { name: 1 } },
  });

  console.log(doc);
  console.log(doc.groups);

  /* FIN */
  await deconnexion();
}

main();
