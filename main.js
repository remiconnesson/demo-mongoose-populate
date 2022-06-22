const { connexion, deconnexion } = require("./connexion");

async function main() {
  await connexion();

  await deconnexion();
}

main();
