const db = require("../database/database");

const friendshipModel = {
  executeQuery(query, callback) {
    db.query(query, (err, res) => callback(err, res));
  },

  create(params, callback) {
    // crear amistad y solicitud
    const { user, friend, status } = params;

    let query = `INSERT INTO AMISTAD (usuario, amigo, estado) 
        VALUES ('${user}', '${friend}', 0 );  `;

    return this.executeQuery(query, callback);
  },

  getRequests(params, callback) {
    const { username } = params;

    let query = `SELECT u.username, u.nombre AS name, u.foto AS profile_picture, u.modoBot AS bot_mode FROM AMISTAD a, USUARIO u
        WHERE amigo =  '${username}' AND u.username = a.usuario AND estado = 0 `;

    return this.executeQuery(query, callback);
  },

  update(params, callback) {
    // confirm friend request
    const { user, friend } = params;

    let query = `UPDATE AMISTAD
        SET estado = 1
        WHERE usuario = '${user}' AND amigo = '${friend}'`;

    return this.executeQuery(query, callback);
  },

  delete(params, callback) {
    const { user, friend } = params;

    let query = `DELETE FROM AMISTAD 
        WHERE usuario = '${user}' AND amigo = '${friend}'`;

    return this.executeQuery(query, callback);
  },

  getFriends(params, callback) {
    const { username } = params;

    let query = `(select username, nombre as name, foto as profile_picture, modobot as bot_mode  from USUARIO u, AMISTAD a
            where a.usuario = '${username}' and a.amigo = u.username and a.estado = 1)
            UNION
            (select username, nombre as name, foto as profile_picture, modobot as bot_mode  from USUARIO u, AMISTAD a
            where a.usuario = u.username and a.amigo = '${username}'  and a.estado = 1);`;

    return this.executeQuery(query, callback);
  },

  getNoFriends(params, callback) {
    const { username } = params;

    let query = `SELECT u.username, u.nombre AS name, u.foto AS profile_picture, u.modobot AS bot_mode FROM USUARIO u
        WHERE u.username NOT IN (SELECT a.amigo FROM AMISTAD a 
        WHERE a.usuario = '${username}' UNION  SELECT a.usuario FROM AMISTAD a 
        WHERE a.amigo = '${username}') AND u.username !=  '${username}';`;

    return this.executeQuery(query, callback);
  },
};

module.exports = friendshipModel;
