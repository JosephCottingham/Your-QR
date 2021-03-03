const mongoose = require('mongoose');
require('dotenv').config()

const mongoUri = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/qr-code-db'

mongoose.set('useUnifiedTopology', true)
mongoose.set('useFindAndModify', false)
mongoose.connect(mongoUri, { useNewUrlParser: true })

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`)
})

module.exports = mongoose.connection
