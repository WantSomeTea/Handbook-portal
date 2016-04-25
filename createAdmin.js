var pwd = require('pwd');
var orm = require('orm');
var config = require('config');


var admin= {
    "username": "user",
    "password": "secret",
    "id_company": 1
};
var opts= {
    "host": "127.0.0.1",
    "database": "mydb",
    "user": "root",
    "password": "secret",
    "protocol": "mysql",
    "port": "3306",
    "query": {
        "pool": true
    }
};


orm.connect(opts, function (err, db) {
    if (err) {
        console.log(err);
    }
    var Admin = db.define('admin', {
        id_company          : {
            type: 'number',
            required: true,
            key: true
        },
        username: {
            type: 'text',
            required: true,
            key: true,
            unique: true
        },
        salt                : String,
        hash                : String
    });
    pwd.hash(admin.password, function(err, salt, hash) {
        if (!err) {
            Admin.create({
                username: admin.username,
                id_company: admin.id_company,
                salt: salt,
                hash: hash
            }, function (err) {
                if (err) {
                    console.log(err);
                }
                console.log('+');
                Admin.find({username: admin.username}, function (err, people) {
                    if (err) {
                        console.log(err);
                    }
                    pwd.hash('password', people[0].salt, function (err, hash) {
                        if (people[0].hash == hash) {
                            console.log(people);
                        }
                    });
                    console.log("People found:", people);
                    console.log("customerID:", people[0].customerID);
                });
            });
        }
    })
});