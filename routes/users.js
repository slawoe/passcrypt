const express = require("express");
const router = express.Router();

require("dotenv").config();
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");

router.use(bodyParser.json());

function createUsersRouter(database) {
  const collection = database.collection("users");
  router.get("/", (request, response) => {
    response.send("We`re on users");
  });

  router.post("/:name", async (request, response) => {
    const username = "Slawomir";
    const password = "abcd";
    if (username === "Slawomir" && password === "abc") {
      try {
        console.log(`Request /api/users/${request.params.name}`);
        const user = await collection.findOne({
          username: request.params.name,
        });
        response.json(user);
      } catch (error) {
        console.error("Something went wrong 😑", error);
        response.status(500).send(error.message);
      }
    } else {
      console.log("Password or username incorrect");
      response.send("Password and username incorrect");
    }
  });

  return router;
}

module.exports = createUsersRouter;
