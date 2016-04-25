/**
 * Created by pavtr_000 on 11.03.2016.
 */
var express = require('express'),
    router = express.Router(),
    checkAuth = require('./../middleware/checkAuth'),
    company = require('./../middleware/getSettings');

router.get('/', checkAuth, company, function(req, res, next) {
    res.render('index', {
        title: req.company.name,
        username: req.session.user.username
    });
});

router.get('/signin', function(req, res, next) {
    res.render('signin');
});

router.post('/signout', function (req, res) {
    req.session.destroy();
    res.redirect('/signin');
});

module.exports = router;
