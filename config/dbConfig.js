const connectionUri = process.env.NODE_ENV === 'staging' ? process.env.DATABASE_URI || "mongodb://localhost:27017/soclone" : process.env.DATABASE_TEST_URI || "mongodb://localhost:27017/soclonetest";

module.exports = connectionUri;
