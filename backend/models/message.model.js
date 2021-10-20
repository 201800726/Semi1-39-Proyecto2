const database = require("../database/database");

const MessageModel = {
  executeQuery(query, callback) {
    database.query(query, (err, res) => callback(err, res));
  },

  get(params, callback) {
    const { emmiter, receiver } = params;

    let query = `select * from (
            (select * from MENSAJE where emisor = "${emmiter}" and receptor = "${receiver}")
            UNION
            (select * from MENSAJE where emisor = "${receiver}" and receptor = "${emmiter}")) a order by fecha;`;

    return this.executeQuery(query, callback);
  },
};

module.exports = MessageModel;
