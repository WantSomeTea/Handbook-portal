/**
 * Created by pavtr_000 on 11.03.2016.
 */
module.exports = function (db) {
    return db.define('job', {
        id_job: {
            type: 'number',
            required: true,
            unique: true,
            key: true
        },
        name: {
            type: 'text'
        },
        id_department: {
            type: 'number',
            required: true
        }
    });
};