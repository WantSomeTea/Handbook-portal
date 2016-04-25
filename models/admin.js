module.exports = function (db) {
  return db.define('admin', {
    id_company: {
      type: 'text',
      required: true,
      key: true
    },
    username: {
      type: 'text',
      required: true,
      key: true,
      unique: true
    },
    salt: {
      type: 'text',
      required: true,
      unique: true
    },
    hash: {
      type: 'text',
      required: true,
      unique: true
    }
  });
};


