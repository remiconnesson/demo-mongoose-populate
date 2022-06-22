// Ce fichier contient le nécessaire pour vous connecter à mongoose.
const mongoose = require("mongoose");

// vous devez intégrer dans un fichier `.env` la variable d'environnement ci-dessou
// DB_URI=<l'url de votre base de données mongo avec la db utilisée>
require("dotenv").config();
const dbUri = process.env.DB_URI;
if (!dbUri) {
  console.error("please provide DB_URI env variable");
  process.exit(1);
}

// fonction a appellé pour lancer la connexion
async function connexion() {
  try {
    console.log("Connecting to mongo...");
    await mongoose.connect(dbUri);
    console.log("Connected.");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

async function deconnexion() {
  try {
    console.log("Disconnecting from mongo...");
    await mongoose.connection.close();
    console.log("Disconnected.");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = { connexion, deconnexion };
