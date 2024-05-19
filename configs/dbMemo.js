const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express')


const mongoDbMemory = {
  connect: async () => {
    const mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()

    await mongoose.connect(mongoUri, { dbName: 'testinDb' })
    console.log(`MongoMemoryServer successfully connected to ${mongoUri}`)
  },

  disconnect: async () => {
    await mongoose.disconnect()
  }
}

module.exports = mongoDbMemory














