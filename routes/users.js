const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

require("dotenv").config();
const bodyParser = require("body-parser");

router.use(bodyParser.json());

function createUsersRouter(database, masterPassword) {
  const collection = database.collection("users");

  router.post("/login", async (request, response) => {
    try {
      const { username, password } = request.body;
      const user = await collection.findOne({
        username,
        password,
      });
      if (!user) {
        response.status(401).send(`wrong username or password`);
        return;
      }
      const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: "60s",
      });
      response.setHeader("Set-Cookie", `authToken=${token};path=/;Max-Age=60`);
      response.send("Logged in");
    } catch (error) {
      console.error("Something went wrong 😑", error);
      response.status(500).send(error.message);
    }
  });

  return router;
}

module.exports = createUsersRouter;
