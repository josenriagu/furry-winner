const connectionUri = process.env.NODE_ENV === 'staging' ? process.env.DATABASE_URI || "mongodb://localhost:27017/softcom" : process.env.DATABASE_TEST_URI || "mongodb://localhost:27017/softcomtest";

module.exports = connectionUri;
