const router = require("express").Router()
const {Example} = require('../db/models/Example')

//routes go here
router.get('/example', async (req, res, next)=> {
  try {
    res.send(await Example.findAll());
  }
  catch(ex){
    next(ex);
  }
});

module.exports = router
