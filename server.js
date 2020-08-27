require("dotenv").config();

const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const { writePassword, readPassword } = require("./lib/passwords");
const { encrypt, decrypt } = require("./lib/crypto");

const client = new MongoClient(process.env.MONGO_URL, {
  useUnifiedTopology: true,
});
const app = express();
app.use(bodyParser.json());

const port = 3000;

async function main() {
  try {
    await client.connect();
    const database = client.db(process.env.MONGO_DB);
    const masterPassword = process.env.MASTER_PASSWORD;

    app.get("/api/passwords/:name", async (request, response) => {
      try {
        const { name } = request.params;
        const password = await readPassword(name, database);
        const decryptedPassword = decrypt(password, masterPassword);
        response.status(200).send(decryptedPassword);
      } catch (error) {
        console.error("Something went wrong 😑", error);
      }
    });

    app.post("/api/passwords", async (request, response) => {
      try {
        console.log("POST in /api/passwords");
        const { name, value } = request.body;
        const encryptedPassword = encrypt(value, masterPassword);
        await writePassword(name, encryptedPassword, database);
        response.status(201).send("Password created");
      } catch (error) {
        console.error("Something went wrong 😑", error);
      }
    });

    app.listen(port, function () {
      console.log(`Listening on http://localhost:${port}`);
    });
  } finally {
    await client.close();
  }
}

main();

// MongoClient.connect(
//   process.env.MONGO_URL,
//   {
//     useUnifiedTopology: true,
//   },
//   async (err, client) => {
//     if (err) return console.log(err);
//     await console.log("Conected to database");
//     const database = client.db(process.env.MONGO_DB);
//     const collection = await database.collection("quotes");
//     try {
//       app.post("/quotes", async (req, res) => {
//         await collection.insertOne(req.body);
//         (result) => {
//           res.redirect(`/`);
//         };
//         console.log(result);
//       });
//     } catch (error) {
//       console.error("Something went wrong 😑", error);
//     }
//   }
// );
