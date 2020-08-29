const express = require("express")
const morgan = require('morgan')
const path = require('path')
const { db } = require('./db')

//initialize app
const app = express()

// Logging middleware
app.use(morgan("dev"))

// Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Static file-serving middleware
app.use(express.static(path.join(__dirname, 'public')))

//require in your routes and use them on your api path
app.use('/api', require('./routes'))

//404 handler
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})

//500 handler
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

//set PORT
const PORT = process.env.PORT || 3000

//listen
const init = async () => {
  try {
    await db.sync();
    app.listen(PORT, () => console.log(`

          Listening on port ${PORT}

          http://localhost:${PORT}/

      `));
  } catch (err) {
    console.log(`There was an error starting up!`, err);
  }
}

init();
