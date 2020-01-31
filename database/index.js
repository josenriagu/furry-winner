const mongoose = require("mongoose");

const connectionUri = require("../config/dbConfig");

/* this line fixes this warning:
  * DeprecationWarning: collection.ensureIndex is deprecated.Use createIndexes instead.
  * it can also be silenced by using the node flag --no-deprecation
*/
mongoose.set("useCreateIndex", true);
/* this line fixes this warning:
  * DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are * deprecated. See: https://mongoosejs.com/docs/deprecations.html#-findandmodify-
*/
mongoose.set("useFindAndModify", false);

module.exports = async () => {
  try {
    await mongoose.connect(connectionUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");
  } catch (error) {
    console.log(`Connection to database failed: ${error.message}`);
  }
};
