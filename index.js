const express = require('express')
const path = require('path')

const controller = require('./src/controller')
const config = require('./config')

const app = express()

app.use('/static/', express.static(path.join(__dirname, 'views')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', controller.render)

app.use('*', (req, res) => {
  const errorMessage = `Unknown path: ${req.protocol}://${req.get('host')}${req.originalUrl}`
  console.log(errorMessage)
  res.status(404)
  res.send(errorMessage)
})

app.use((error, req, res) => {
  console.log(error)
  res.status(500).send('Ooops')
})

process.on('unhandledRejection', error => {
  console.log('Unhandled error', error)
})

console.log('port:' + config.port)
app.listen(config.port)