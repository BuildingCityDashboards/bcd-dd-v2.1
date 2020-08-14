const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Dublin Dashboard', page: 'page dark', active: 'home' })
})
// redirects for old page
router.get('/pages/index', function (req, res, next) {
  res.redirect(301, '/')
})

// redirects for old page
router.get('/index', function (req, res, next) {
  res.redirect(302, '/')
})

// redirects for old page
router.get('/home', function (req, res, next) {
  res.redirect(302, '/')
})

router.get('/.well-known/pki-validation/godaddy.html', function (req, res, next) {
  res.send('3htnrec99acmov7afigq82f6vj')
})

module.exports = router
