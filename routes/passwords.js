const express = require("express");
const router = express.Router();

require("dotenv").config();
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const { writePassword, readPassword } = require("../lib/passwords");
const { encrypt, decrypt } = require("../lib/crypto");

router.use(bodyParser.json());

function createPasswordsRouter(database, masterPassword) {
  const collection = database.collection("passwords");
  router.get("/", (request, response) => {
    response.send("We`re on passwords");
  });

  router.get("/:name", async (request, response) => {
    try {
      const { name } = request.params;
      const encryptedPassword = await readPassword(name, database);
      if (!encryptedPassword) {
        response.status(404).send(`Password ${name} not found`);
        return;
      }
      const decryptedPassword = decrypt(encryptedPassword, masterPassword);
      response.status(200).send(decryptedPassword);
    } catch (error) {
      console.error("Something went wrong 😑", error);
      response.status(500).send(error.message);
    }
  });

  router.post("/", async (request, response) => {
    try {
      console.log("POST in /api/passwords");
      const { name, value } = request.body;
      const encryptedPassword = encrypt(value, masterPassword);
      await writePassword(name, encryptedPassword, database);
      response.status(201).send("Password created");
    } catch (error) {
      console.error("Something went wrong 😑", error);
      response.status(500).send(error.message);
    }
  });

  router.delete("/:passwordName", async (request, response) => {
    try {
      console.log(`Delete /api/passwords/${request.params.passwordName}`);
      const password = await collection.deleteOne({
        name: request.params.passwordName,
      });
      response.json(password);
    } catch (error) {
      console.error("Something went wrong 😑", error);
    }
  });
  return router;
}

module.exports = createPasswordsRouter;
