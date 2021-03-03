const express = require('express')
const codeRoutes = require('./code.js')
const userRoutes = require('./user.js')

const router = express.Router()

router.use('/api/v1/codes', codeRoutes)
router.use('/', userRoutes)

module.exports = router