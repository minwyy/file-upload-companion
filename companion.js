const express = require('express')
const companion = require('./node_modules/@uppy/companion')
const bodyParser = require('body-parser')
const session = require('express-session')

const app = express()

app.use(bodyParser.json())
app.use(session({
  secret: 'some-secret',
  resave: true,
  saveUninitialized: true
}))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, Origin, Content-Type, Accept'
  )
  next()
})

// Routes
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain')
  res.send('Welcome to Companion')
})

// initialize uppy
const uppyOptions = {
  providerOptions: {
    drive: {
      key: '70505765313-0i75fto3f1a8881o2u8nmln3lm6jgk7j.apps.googleusercontent.com',
      secret: 'Ju_fwC2nhpNU_39qM_pSjWrG'
    },
    onedrive: {
      key: '18339880-9e1d-4fbf-8997-c7038269b69c',
      secret: 'VYjzE5yy-7_-rgWK7DVdN~chOe_R2~pYLy'
    }

    // instagram: {
    //   key: 'your instagram key',
    //   secret: 'your instagram secret'
    // }
    // you can also add options for dropbox here
  },
  server: {
    host: 'localhost:3020',
    protocol: 'http'
  },
  filePath: './output',
  secret: 'some-secret',
  debug: true
}

app.use(companion.app(uppyOptions))

// handle 404
app.use((req, res, next) => {
  return res.status(404).json({ message: 'Not Found' })
})

// handle server errors
app.use((err, req, res, next) => {
  console.error('\x1b[31m', err.stack, '\x1b[0m')
  res.status(err.status || 500).json({ message: err.message, error: err })
})

companion.socket(app.listen(3020), uppyOptions)

console.log('Welcome to Companion!')
console.log(`Listening on http://0.0.0.0:${3020}`)
