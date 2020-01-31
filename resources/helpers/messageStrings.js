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
  noData: "Please supply some data in your request!",
  tokenInvalid: "Token validation failed!",
  supplyToken: "Please supply token!",
  invalidEmail: "Not a valid email address format",
  obscured: "Errm, don't worry about this one now!",
  tooShort: "Either your question or answer is rather too short",
  qExists: "Hollit rai there!✋ This question has been asked by either you or someone else, could you please check the community?",
  qCreated: "Question successfully created",
  qRetrieved: "Question successfully retrieved",
  qsRetrieved: "Questions successfully retrieved",
  qRemoved: "Question successfully removed",
  aExists: "Hollit rai there!✋ This answer has already been recorded for this question, could you please check the responses?",
  aCreated: "Answer successfully saved",
  aRemoved: "Answer successfully removed",
  invalidId: "Oops! That doesn't look like a valid Id",
  invalidType: "Oops! Vote 'type' must be either 'up' or 'down'",
  voteUpdated: "Votes successfully updated",
  mailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};
