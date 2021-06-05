var express = require('express')
var router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the GanacheStart page route
router.get('/startWallet', function (req, res) {
  res.send('Birds home page')
  res.json()
})
// define the about route
router.get('/about', function (req, res) {
  res.send('About birds')
})

module.exports = router