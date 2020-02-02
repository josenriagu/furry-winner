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
  tooShort: "Either your question or answer is rather too short",
  qBase: "/api/v1/questions",
  qExists: "Hollit rai there!✋ This question has been asked by either you or someone else, could you please check the community?",
  qCreated: "Question successfully created",
  qRetrieved: "Question successfully retrieved",
  qsRetrieved: "Questions successfully retrieved",
  qASubscribed: "You have already subscribed to this question",
  qSubscribed: "Question successfully added to your list of subscriptions",
  qRemoved: "Question successfully removed",
  nqRetrieved: "Tada! No questions yet! Why not try asking 'Why is Node called Node?'😉",
  aExists: "Hollit rai there!✋ This answer has already been recorded for this question, could you please check the responses?",
  aCreated: "Answer successfully saved",
  aRemoved: "Answer successfully removed",
  aBlocked: "You cannot answer your own question. You may however choose which of answers provides the best solution",
  invalidId: "Oops! That doesn't look like a valid Id",
  invalidType: "Oops! Vote 'type' must be either 'up' or 'down'",
  voteUpdated: "Votes successfully updated",
  nkeyword: "Your search is missing a valid keyword",
  sCompleted: "Search successfully completed",
  mailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};
