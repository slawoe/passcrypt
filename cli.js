const {
  askAccessQuestions,
  askChoice,
  askPasswordRequests,
  askNewPassword,
  askForMasterPassword,
  CHOICE_GET,
  CHOICE_SET,
} = require("./lib/questions");
const {
  readPassword,
  writePassword,
  readMasterPassword,
  writeMasterPassword,
} = require("./lib/passwords");
const { encrypt, decrypt, createHash, verifyHash } = require("./lib/crypto");

async function main() {
  const masterMasterPassword = await readMasterPassword();
  if (!masterMasterPassword) {
    const { newMasterPassword } = await askForMasterPassword();
    await writeMasterPassword(newMasterPassword);
    console.log("MP set");
    return;
  }

  const { masterPassword, username } = await askAccessQuestions();
  if (masterPassword === masterMasterPassword && username === "Slawo") {
    console.log("Welcome");
    const { option } = await askChoice();
    if (option === CHOICE_GET) {
      console.log("Ok, buddy!");
      const { key } = await askPasswordRequests();
      try {
        const password = await readPassword(key);
        const decryptedPassword = decrypt(password, masterMasterPassword);
        console.log(
          `Hi ${username}, your needed password for ${key} is: ${decryptedPassword}!`
        );
      } catch (error) {
        console.error("Something went wrong 😑");
      }
    } else if (option === CHOICE_SET) {
      console.log("Let's go my friend!");
      try {
        const { title, password } = await askNewPassword();
        const encryptedPassword = encrypt(password, masterMasterPassword);
        await writePassword(title, encryptedPassword);
        console.log(
          `You set up a password for ${title}. The new password is: ${password}`
        );
      } catch (error) {
        console.error("Something went wrong 😑");
      }
    }
  } else console.log("Your password or unsername is wrong");
}

main();
