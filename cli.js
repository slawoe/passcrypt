const {
  askAccessQuestions,
  askChoice,
  askPasswordRequests,
  askNewPassword,
  CHOICE_GET,
  CHOICE_SET,
} = require("./lib/questions");
const { readPassword, writePassword } = require("./lib/passwords");
const { encrypt, decrypt, createHash, verifyHash } = require("./lib/crypto");

async function main() {
  const { masterPassword, username } = await askAccessQuestions();
  if (masterPassword === "123" && username === "Slawo") {
    console.log("Welcome");
    const { option } = await askChoice();
    if (option === CHOICE_GET) {
      console.log("Ok, buddy!");
      const { key } = await askPasswordRequests();
      try {
        const password = await readPassword(key);
        console.log(
          `Hi ${username}, your needed password for ${key} is: ${password}!`
        );
      } catch (error) {
        console.error("Something went wrong 😑");
      }
    } else if (option === CHOICE_SET) {
      console.log("Let's go my friend!");
      const { title, password } = await askNewPassword();
      const encryptedPassword = encrypt(password, masterPassword);
      console.log(encryptedPassword);
      await writePassword(title, encryptedPassword);
      console.log(
        `You set up a password for ${title}. The new password is: ${password}`
      );
    }
  } else console.log("Your password or unsername is wrong");
}

main();
