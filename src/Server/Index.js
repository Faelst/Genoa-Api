const express = require('express')
const server = express()
const router = express.Router();
const port =  process.env.DEV_PORT || 8080;
const cors = require('../Config/Cors.js')
const bodyParser = require('body-parser')

server.use(bodyParser.json())
server.use(cors)
server.listen(port ,() => console.log(`listening: http://localhost:${port}`))
server.use('/genoa_api/v1' , router)

module.exports = router