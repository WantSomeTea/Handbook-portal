module.exports = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.set('Content-Type', 'text/html');
        res.status(401).send('<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/signin"></head></html>');
    }
};
