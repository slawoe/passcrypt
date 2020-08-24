const inquirer = require("inquirer");
const fs = require("fs").promises;

const questions = [
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
  {
    type: "input",
    name: "key",
    message: "Which password do you need?",
  },
];

inquirer.prompt(questions).then(async (answers) => {
  if (answers.password === "123" && answers.username === "Slawo") {
    try {
      const passwordsJSON = await fs.readFile("./passwords.json", "utf-8");
      const passwords = JSON.parse(passwordsJSON);
      console.log(
        `Hi ${answers[`username`]}, your needed password for ${answers.key} is: 
      ${passwords[answers.key]}!`
      );
    } catch (error) {
      console.error("Something went wrong 😑");
    }
  } else console.log(`Your password or username is wrong`);
});
