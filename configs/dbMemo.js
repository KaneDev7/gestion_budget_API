const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');


module.exports = connect = async () =>{
  const mongoServer = await MongoMemoryServer.create()
  const mongoUri =  mongoServer.getUri()

  await mongoose.connect(mongoUri, {dbName : 'testinDb'})
  console.log(`MongoMemoryServer successfully connected to ${mongoUri}`)
}












