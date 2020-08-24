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

const choice = [
  {
    type: "list",
    name: "option",
    message: "What do you want to do?",
    choices: ["Get a password", "Create a new password"],
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

const content = "Some content!";

inquirer.prompt(accessQuestions).then((answers) => {
  if (answers.password === "123" && answers.username === "Slawo") {
    console.log("Welcome");
    inquirer.prompt(choice).then(async (answers) => {
      if (answers.option === "Get a password") {
        console.log("ok, buddy");
        inquirer.prompt(passwordRequest).then(async (answers) => {
          try {
            const passwordsJSON = await fs.readFile(
              "./passwords.json",
              "utf-8"
            );
            const passwords = JSON.parse(passwordsJSON);
            console.log(
              `Hi ${answers[`username`]}, your needed password for ${
                answers.key
              } is:
                  ${passwords[answers.key]}!`
            );
          } catch (error) {
            console.error("Something went wrong 😑");
          }
        });
      } else {
        inquirer.prompt(newPassword).then((answers) => {});
      }
    });
  } else {
    console.log(`Your password or username is wrong`);
  }
});
