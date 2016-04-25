/**
 * Created by pavtr_000 on 11.03.2016.
 */
var config = require('config'),
  express = require('express'),
  router = express.Router(),
  checkAuth = require('./../middleware/checkAuth'),
  employees = require('./api/employees'),
  signin = require('./api/signin'),
  settings = require('./api/settings');


router.all('*', function (req, res, next) {
  next();
});

router.use('/employees', checkAuth, employees);
router.use('/signin', signin);
router.use('/settings',checkAuth, settings);

module.exports = router;