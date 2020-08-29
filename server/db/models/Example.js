const Sequelize = require("sequelize") //for things like Sequelize.STRING
//import your db
const db = require('../db')
//define your model
const Example = db.define('example', {
  name: Sequelize.STRING,
})

//define any class or instance methods

//export your model
module.exports = Example
