const inquirer = require("inquirer");

const CHOICE_GET = "Get a password";
const CHOICE_SET = "Set a password";

const accessQuestions = [
  {
    type: "input",
    name: "username",
    message: "What's your username?",
  },
  {
    type: "password",
    name: "masterPassword",
    message: "What's your masterpassword?",
  },
];

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
    name: "title",
    message: "What is the password for?",
  },
  {
    type: "input",
    name: "password",
    message: "What is the password?",
  },
];

function askAccessQuestions() {
  return inquirer.prompt(accessQuestions);
}

function askChoice() {
  return inquirer.prompt(choice);
}

function askPasswordRequests() {
  return inquirer.prompt(passwordRequest);
}

function askNewPassword() {
  return inquirer.prompt(newPassword);
}

exports.askAccessQuestions = askAccessQuestions;
exports.askChoice = askChoice;
exports.askPasswordRequests = askPasswordRequests;
exports.askNewPassword = askNewPassword;
exports.CHOICE_GET = CHOICE_GET;
exports.CHOICE_SET = CHOICE_SET;
