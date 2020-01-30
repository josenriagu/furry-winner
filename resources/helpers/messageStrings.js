/* eslint-disable comma-dangle */
/* eslint-disable no-useless-escape */
module.exports = {
  regWelcome(name) {
    return `Welcome aboard, ${name}!! May your stacks never stop overflowing`;
  },
  loginWelcome(name) {
    return `Welcome ${name}!`;
  },
  alreadyInUse: "Email already in use",
  invalid: "Oops! Invalid Credentials",
  missingFields: "You are missing some required fields!",
  noUserData: "Please supply user data in your request!",
  tokenInvalid: "Token validation failed!",
  supplyToken: "Please supply token!",
  invalidEmail: "Not a valid email address format",
  obscured: "Errm, don't worry about this one now!",
  mailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};
