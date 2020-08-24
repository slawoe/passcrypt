const {
  askAccessQuestions,
  askChoice,
  askPasswordRequests,
  askNewPassword,
  CHOICE_GET,
  CHOICE_SET,
} = require("./lib/questions");
const { readPassword } = require("./lib/passwords");

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
          `Hi ${username}, your needed password for ${key} is:
                            ${password}!`
        );
      } catch (error) {
        console.error("Something went wrong 😑");
      }
    } else if (option === CHOICE_SET) {
      console.log("Let's go my friend!");
      const { title, password } = await askNewPassword();
      console.log(
        `You set up a password for ${title}. The new password is: ${password}`
      );
    }
  } else console.log("Your password or unsername is wrong");
}

main();
