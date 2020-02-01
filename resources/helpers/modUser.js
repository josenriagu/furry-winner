// This module will trim unnecessary data in the user object
module.exports = (user) => {
  const modUser = user;
  // Do not return the password field. Why should you, anyways? 😁
  delete modUser.password;
  delete modUser.__v;
  delete modUser._id; // We do not need the user id anymore, it is already encrypted in the token
  return modUser;
};
