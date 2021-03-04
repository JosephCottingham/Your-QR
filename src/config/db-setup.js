const mongoose = require('mongoose');
require('dotenv').config()

const mongoUri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`;
console.log(mongoUri);
mongoose.set('useUnifiedTopology', true)
mongoose.set('useFindAndModify', false)
mongoose.connect(mongoUri, { useNewUrlParser: true })

mongoose.connect(mongoUri, { useNewUrlParser: true }).then( function() {
  console.log('MongoDB is connected');
})
  .catch( function(err) {
  console.log(err);
});

module.exports = mongoose.connection
