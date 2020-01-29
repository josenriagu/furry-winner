const mongoose = require("mongoose");

const connectionUri = require("../config/dbConfig");

// this line fixes this warning:
// (node: 18804) DeprecationWarning: collection.ensureIndex is deprecated.Use createIndexes instead.
// it can also be silenced by using the node flag --no-deprecation
mongoose.set("useCreateIndex", true);

module.exports = async () => {
  try {
    await mongoose.connect(connectionUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (process.env.NODE_ENV !== "test") console.log("Connected to database");
  } catch (error) {
    if (process.env.NODE_ENV !== "test") console.log(`Connection to database failed: ${error.message}`);
  }
};
