const createError = require("http-errors");

const genError = (code, message) => {
  // Generate error based on the provided status code
  const error = createError(code);
  // Replace error stack with clearer message to be sent back to user
  error.stack = message;
  return error;
};

module.exports = genError;
