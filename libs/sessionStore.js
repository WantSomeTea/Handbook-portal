/**
 * Created by pavtr_000 on 11.03.2016.
 */
module.exports = function (session) {
  var config = require('config');

  var cfg = config.get('redis');

  var redisStore = require('connect-redis')(session);
  return new redisStore({
    host: cfg.host,
    port: cfg.port
  });
};
