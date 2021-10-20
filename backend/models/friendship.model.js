const db = require("../database/database");

const friendshipModel = {
  executeQuery(query, callback) {
    db.query(query, (err, res) => callback(err, res));
  },

  sendFriendRequest(params, callback) {
    const { user, friend } = params;

    let query = `INSERT INTO SOLICITUD (usuario, amigo, estado) 
        VALUES ('${user}', '${friend}', false)`;

    return this.executeQuery(query, callback);
  },

  create(params, callback) {
    const { user, friend } = params;

    let query = `INSERT INTO AMISTAD (usuario, amigo) 
        VALUES ('${user}', '${friend}'); 

        INSERT INTO AMISTAD (usuario, amigo) 
        VALUES ('${friend}', '${user}' ); `;

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
