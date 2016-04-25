/**
 * Created by pavtr_000 on 11.03.2016.
 */
var async = require('async'),
  pwd = require('pwd'),
  error = require('./../../libs/error'),
  express = require('express'),
  router = express.Router();

router.post('/signin', function (req, res, next) {
  var username = req.query.username,
    password = req.query.password;
  async.waterfall([
    function (callback) {
      req.models.admin.find({username: username}, callback);
    },
    function (user, callback) {
      if (user.length != 0) {
        pwd.hash(password, user[0].salt, function (err, hash) {
          if (err) {
            callback(err);
          }
          if (user[0].hash == hash) {
            callback(null, user);
          } else {
            next(error(404, 'Неверное имя пользователя или пароль'));
          }
        })
      } else {
        next(error(404, 'Неверное имя пользователя или пароль'));
      }
    }], function (err, user) {
    if (err) {
      next(error(500, 'Ошибка аутентификации'));
    } else if (user) {
      req.session.user = {
        id_company: user[0].id_company,
        username: user[0].username
      };
      res.send(200);
    }
  });
});


module.exports = router;