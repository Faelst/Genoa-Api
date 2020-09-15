const express = require('express')
const server = express()
const router = express.Router();
const cors = require('../Config/Cors.js')
const bodyParser = require('body-parser')

server.use(bodyParser.json())
server.use(cors)
server.use('/genoa_api/v1' , router)

module.exports = server