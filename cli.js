const inquirer = require("inquirer");
const fs = require("fs").promises;

const accessQuestions = [
  {
    type: "input",
    name: "username",
    message: "What's your username?",
  },
  {
    type: "password",
    name: "password",
    message: "What's your masterpassword?",
  },
];

const CHOICE_GET = "Get a password";
const CHOICE_SET = "Set a password";

const choice = [
  {
    type: "list",
    name: "option",
    message: "What do you want to do?",
    choices: [CHOICE_GET, CHOICE_SET],
  },
];

const passwordRequest = [
  {
    type: "input",
    name: "key",
    message: "Which password do you want to get?",
  },
];

const newPassword = [
  {
    type: "input",
    name: "topicPassword",
    message: "What is the password for?",
  },
  {
    type: "input",
    name: "newPassword",
    message: "What is the password?",
  },
];

inquirer.prompt(accessQuestions).then((answers) => {
  if (answers.password === "123" && answers.username === "Slawo") {
    console.log("Welcome");
    inquirer.prompt(choice).then(async (choice) => {
      if (choice.option === CHOICE_GET) {
        console.log("ok, buddy");
        inquirer.prompt(passwordRequest).then(async (key) => {
          try {
            const passwordsJSON = await fs.readFile(
              "./passwords.json",
              "utf-8"
            );
            const passwords = JSON.parse(passwordsJSON);
            console.log(
              `Hi ${answers.username}, your needed password for ${key.key} is:
                  ${passwords[key.key]}!`
            );
          } catch (error) {
            console.error("Something went wrong 😑");
          }
        });
      } else {
        inquirer.prompt(newPassword).then((options) => {});
      }
    });
  } else {
    console.log(`Your password or username is wrong`);
  }
});
