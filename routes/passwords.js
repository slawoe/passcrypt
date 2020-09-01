const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

require("dotenv").config();
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const {
  writePassword,
  readPassword,
  deletePassword,
  updatePassword,
} = require("../lib/passwords");
const { encrypt, decrypt } = require("../lib/crypto");

router.use(bodyParser.json());

router.use((request, response, next) => {
  try {
    const { authToken } = request.cookies;
    const { username } = jwt.verify(authToken, process.env.JWT_SECRET);
    console.log(`Allow access to ${username}`);
    next();
  } catch (error) {
    console.error("Something went wrong 😑", error);
    response.status(401).send("No access!");
  }
});

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
    const { name, value } = request.body;
    try {
      console.log("POST in /api/passwords");

      const existingPassword = await readPassword(name, database);
      if (existingPassword) {
        response.status(409).send("Password already exists");
        return;
      }

      const encryptedPassword = encrypt(value, masterPassword);
      await writePassword(name, encryptedPassword, database);

      response.status(201).send("Password created");
    } catch (error) {
      console.error("Something went wrong 😑", error);
      response.status(500).send(error.message);
    }
  });

  router.patch("/:name", async (request, response) => {
    try {
      const { name } = request.params;
      const { name: newName, value: newValue } = request.body;

      const existingPassword = await readPassword(name, database);
      if (!existingPassword) {
        response.status(404).send("Password doesn't exists");
        return;
      }

      // if (newName && newValue) {
      //   updatePassword(
      //     newName,
      //     encrypt(newValue, masterPassword),
      //     database
      //   );
      // } else if (newName) {
      //   updatePassword(
      //     newName,
      //     existingPassword,
      //     database
      //   );
      // } else if (newValue) {
      //   updatePassword(
      //     name,
      //     encrypt(newValue, masterPassword),
      //     database
      //   );
      // }

      await updatePassword(
        newName || name,
        newValue ? encrypt(newValue, masterPassword) : existingPassword,
        database
      );

      response.status(200).send("Updated");
    } catch (error) {
      console.error(error);
      response.status(500).send(error.message);
    }
  });

  router.delete("/:name", async (request, response) => {
    try {
      const { name } = request.params;

      const existingPassword = await readPassword(name, database);
      if (!existingPassword) {
        response.status(404).send("Password doesn't exists");
        return;
      }

      await deletePassword(name, database);
      response.status(200).send("Deleted");
    } catch (error) {
      console.error(error);
      response.status(500).send(error.message);
    }
  });

  return router;
}

module.exports = createPasswordsRouter;
