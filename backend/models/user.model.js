const database = require("../database/database");

const userModel = {
  executeQuery(query, callback) {
    database.query(query, (err, res) => callback(err, res));
  },

  register(params, callback) {
    // registro en la base de datos
    const { username, name, image } = params;

    let query = `INSERT INTO USUARIO (username, nombre, foto, modoBot) VALUES ('${username}', '${name}', '${image}', false)`;

    return this.executeQuery(query, callback);
  },

  login(params, callback) {
    const { username } = params;

    let query = `SELECT username, foto AS profile_picture, modoBot AS bot_mode, nombre AS name 
        FROM USUARIO WHERE username = '${username}'`;

    return this.executeQuery(query, callback);
  },

  getCounters(params, callback) {
    // contador de publicaciones y amigos
    const { username } = params;

    let query = `SELECT COUNT(p.idPublicacion) AS counter FROM PUBLICACION p
        WHERE p.usuario = '${username}'
        UNION
        SELECT COUNT(a.username) AS counter FROM (
        (SELECT username FROM USUARIO u, AMISTAD a
        WHERE a.usuario = '${username}' AND a.amigo = u.username AND a.estado = 1)
         UNION
        (SELECT username FROM USUARIO u, AMISTAD a
        WHERE a.usuario = u.username AND a.amigo = '${username}'  AND a.estado = 1)
        ) a;  `;

    return this.executeQuery(query, callback);
  },

  getPhoto(params, callback) {
    // traer foto de perfil
    const { username } = params;

    let query = `SELECT foto AS profile_picture, username, nombre as name, modoBot as bot_mode FROM USUARIO WHERE username = '${username}'`;

    return this.executeQuery(query, callback);
  },

  update(params, callback) {
    // actualizar
    const { username, name, image, bot_mode } = params;

    let query = `UPDATE USUARIO 
        SET  nombre = '${name}' , foto = '${image}', modoBot = ${bot_mode}
        WHERE username = '${username}'`;

    return this.executeQuery(query, callback);
  },
};

module.exports = userModel;
