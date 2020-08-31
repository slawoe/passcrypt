const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

require("dotenv").config();
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");

router.use(bodyParser.json());

// function authenticateToken(resquest, response, next){
//     const authHeader = request.headers[`authorization`]
//     const token = authHeader && authHeader.split(``)[1]
//     if(token == null)return res.sendStatus(401)

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
//         console.log(err)
//         if (err) return res.sendStatus(403)
//         request.user = user
//     next()
// }

function createUsersRouter(database) {
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
      console.log(user);
      response.send("Logged in");
    } catch (error) {
      console.error("Something went wrong 😑", error);
      response.status(500).send(error.message);
    }
  });

  router.get("/", (request, response) => {
    response.send("We`re on users");
  });

  return router;
}

module.exports = createUsersRouter;
