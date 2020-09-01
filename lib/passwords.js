const fs = require("fs").promises;

async function readPassword(name, database) {
  const collection = database.collection("passwords");
  const password = await collection.findOne({ name });
  if (!password) {
    return null;
  }
  return password.value;
}

async function writePassword(name, value, database) {
  const collection = database.collection("passwords");
  await collection.insertOne({
    name: name,
    value: value,
  });
}

async function deletePassword(name, database) {
  const collection = database.collection("passwords");
  await collection.deleteOne({ name: name });
}

async function updatePassword(name, value, database) {
  const collection = database.collection("passwords");
  await collection.updateOne(
    { name: name },
    {
      $set: {
        name: name,
        value: value,
      },
    }
  );
}

async function readMasterPassword() {
  try {
    const masterPassword = await fs.readFile("./masterPassword", "utf-8");
    return masterPassword;
  } catch (error) {
    return null;
  }
}

async function writeMasterPassword(masterPassword) {
  await fs.writeFile("./masterPassword", masterPassword);
}

exports.writePassword = writePassword;
exports.readPassword = readPassword;
exports.deletePassword = deletePassword;
exports.updatePassword = updatePassword;
exports.readMasterPassword = readMasterPassword;
exports.writeMasterPassword = writeMasterPassword;
