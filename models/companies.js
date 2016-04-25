/**
 * Created by pavtr_000 on 11.03.2016.
 */
module.exports = function (db) {
    return db.define('companies', {
        id_company: {
            type: 'number',
            required: true,
            key: true,
            unique: true
        },
        name: {
            type: 'text'
        }
    });
};