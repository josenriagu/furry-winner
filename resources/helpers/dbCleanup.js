/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const mongoose = require("mongoose");

module.exports = {
  async removeAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      await collection.deleteMany();
    }
  },
  async dropAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      try {
        await collection.drop();
      } catch (error) {
        // Sometimes this error happens, but you can safely ignore it
        if (error.message === "ns not found") return;
        // This error occurs when you use it.todo. You can
        // safely ignore this error too
        if (
          error.message.includes("a background operation is currently running")
        ) return;
        console.log(error.message);
      }
    }
  },
};
