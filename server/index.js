const express = require("express")
const morgan = require('morgan')
const path = require('path')
const recipeScraper = require("recipe-scraper");
const enforce = require('express-sslify');

//initialize app
const app = express()

//force SSL if deployed; required for microphone API
if(app.get("env")==="production") app.use(enforce.HTTPS({ trustProtoHeader: true }));

// Logging middleware
app.use(morgan("dev"))

// Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Static file-serving middleware
app.use(express.static(path.join(__dirname, 'public')))

//POST route for recipeScraper
app.post('/', async (req, res, next) => {
  try {
    const recipe = await recipeScraper(req.body.recipeURL)
    res.status(200).send(recipe)
  } catch (err) {
    res.status(400).send({message:err.message})
  }
})

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
const init = () => {
  try {
    app.listen(PORT, () => console.log(`

          Listening on port ${PORT}

          http://localhost:${PORT}/

      `));
  } catch (err) {
    console.log(`There was an error starting up!`, err);
  }
}

init();
