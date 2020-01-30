// This module will trim unnecessary data in the user object
module.exports = (user) => {
  const modUser = user;
  // Do not return the password field. Why should you, anyways? 😁
  delete modUser.password;
  delete modUser.__v;
  modUser.id = modUser._id;
  delete modUser._id;
  return modUser;
};
