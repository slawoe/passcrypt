require("dotenv").config();
const {
  askAccessQuestions,
  askChoice,
  askPasswordRequests,
  askNewPassword,
  askForMasterPassword,
  CHOICE_GET,
  CHOICE_SET,
  CHOICE_DELETE,
} = require("./lib/questions");
const {
  readPassword,
  writePassword,
  deletePassword,
  readMasterPassword,
  writeMasterPassword,
} = require("./lib/passwords");
const {
  encrypt,
  decrypt,
  bcryptHash,
  bcryptHashCompare,
} = require("./lib/crypto");
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URL);

async function main() {
  try {
    await client.connect();
    const database = client.db(process.env.MONGO_DB);

    const masterMasterPassword = await readMasterPassword();
    if (!masterMasterPassword) {
      const { newMasterPassword } = await askForMasterPassword();
      const masterMasterPassword = await bcryptHash(newMasterPassword, 10);
      await writeMasterPassword(masterMasterPassword);
      console.log("MasterPassword set");
      return;
    }

    const { masterPassword, username } = await askAccessQuestions();
    const isPasswordCorrect = await bcryptHashCompare(
      masterPassword,
      masterMasterPassword
    );
    if (isPasswordCorrect && username === "Slawo") {
      console.log("Welcome");
      const { option } = await askChoice();
      if (option === CHOICE_GET) {
        console.log("Ok, buddy!");
        const { key } = await askPasswordRequests();
        try {
          const password = await readPassword(key, database);
          const decryptedPassword = decrypt(password, masterPassword);
          console.log(
            `Hi ${username}, your needed password for ${key} is: ${decryptedPassword}!`
          );
        } catch (error) {
          console.error("Something went wrong 😑", error);
        }
      } else if (option === CHOICE_SET) {
        console.log("Let's go my friend!");
        try {
          const { title, password } = await askNewPassword();
          const encryptedPassword = encrypt(password, masterPassword);
          await writePassword(title, encryptedPassword, database);
          console.log(
            `You set up a password for ${title}. The new password is: ${password}`
          );
        } catch (error) {
          console.error("Something went wrong 😑");
        }
      } else if (option === CHOICE_DELETE) {
        console.log("Ok, bro. Let's delete some stuff!");
        const { key } = await askPasswordRequests();
        try {
          await deletePassword(key, database);
          console.log(`Your password is deleted!`);
        } catch (error) {
          console.error("Something went wrong 😑", error);
        }
      }
    } else console.log("Your password or unsername is wrong");
  } finally {
    await client.close();
  }
}
main();
