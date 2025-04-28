const {User} = require("../../models/User");

const generateUsername = async (full_name) => {
  let baseUsername = full_name.toLowerCase().replace(/\s+/g, ""); 
  let username = baseUsername;
  let count = 1;

  while (await User.findOne({ username })) {
    username = `${baseUsername}${count}`;
    count++;
  }

  return username;
};

module.exports = generateUsername;