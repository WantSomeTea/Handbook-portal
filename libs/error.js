/**
 * Created by pavtr_000 on 11.03.2016.
 */
module.exports = function(code, text) {
    var err = new Error(text);
    err.status = code;
    return err;
};