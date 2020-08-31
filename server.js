require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const createPasswordsRouter = require("./routes/passwords");

const { MongoClient } = require("mongodb");

const app = express();

const port = 3000;

const client = new MongoClient(process.env.MONGO_URL, {
  useUnifiedTopology: true,
});

async function main() {
  await client.connect();
  const database = client.db(process.env.MONGO_DB);
  const masterPassword = process.env.MASTER_PASSWORD;
  app.use(bodyParser.json());
  app.use((request, response, next) => {
    next();
  });

  app.use("/", createPasswordsRouter(database, masterPassword));

  app.listen(port, function () {
    try {
      console.log(`Listening on http://localhost:${port}`);
    } catch (error) {
      console.error("Something went wrong 😑", error);
    }
  });
}

main();

// async function main() {
//   await client.connect();
//   const database = client.db(process.env.MONGO_DB);
//   const masterPassword = process.env.MASTER_PASSWORD;
//   app.get(`/api/passwords/amazon`, async (request, response) => {
//     const key = "amazon";
//     const encryptedPassword = await readPassword(key, database);
//     const password = decrypt(encryptedPassword, masterPassword);
//     response.send(password);
//   });
// }

// app.post("api/passwords", (request, response) => {
//   response.send("123");
// });

// app.get(`/`, function (request, response) {
//   response.sendFile("/Users/slawomirernst/dev/passcrypt" + "/index.html");
// });

// app.listen(port, function () {
//   console.log(`Listening on http://localhost:${port}`);
// });
// main();

// app.use(bodyParser.urlencoded({ extended: true }));

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
