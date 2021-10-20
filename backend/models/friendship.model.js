const db = require("../database/database");

const friendshipModel = {
  executeQuery(query, callback) {
    db.query(query, (err, res) => callback(err, res));
  },

  create(params, callback) {
    // crear amistad y solicitud
    const { user, friend, status } = params;

    let query = `INSERT INTO AMISTAD (usuario, amigo, estado) 
        VALUES ('${user}', '${friend}', ${status});  `;

    return this.executeQuery(query, callback);
  },

  getRequest(params, callback) {
    const { username } = params;

    let query = `SELECT a.usuario FROM AMISTAD a
        WHERE amigo =  '${username}' AND estado = 1; `;

    return this.executeQuery(query, callback);
  },

  update(params, callback) {},

  getNoFriend(params, callback) {
    const { username } = params;

    let query = `SELECT u.* FROM USUARIO u
        WHERE u.username NOT IN (SELECT a.amigo FROM AMISTAD a 
        WHERE a.usuario = '${username}' UNION  SELECT a.usuario FROM AMISTAD a 
        WHERE a.amigo = '${username}') AND u.username !=  '${username}';`;

    return this.executeQuery(query, callback);
  },
  getFriends(params, callback) {
    const { username } = params;

    let query = ` (select username, nombre as name, foto as profile_picture, modobot as bot_mode  from USUARIO u, AMISTAD a
              where a.usuario = '${username}' and a.amigo = u.username and a.estado = 1)
              UNION
              (select username, nombre as name, foto as profile_picture, modobot as bot_mode  from USUARIO u, AMISTAD a
              where a.usuario = u.username and a.amigo = '${username}'  and a.estado = 1);`;

    return this.executeQuery(query, callback);
  },
};

module.exports = friendshipModel;
