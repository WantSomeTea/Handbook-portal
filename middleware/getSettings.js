/**
 * Created by pavtr_000 on 19.03.2016.
 */
module.exports = function(req, res, next) {
  if (!req.session.user){
    return next();
  } else {
    req.models.companies.find({id_company: req.session.user.id_company}, function (err, company) {
      if (err) {
        return next(err);
      }
      req.company = company[0];
      next();
    })
  }
};

