const database = require('../database/database')

const userModel = {
    executeQuery(query, callback) {
        database.query(query, (err, res) => callback(err, res));
    },

    register(params, callback) {  // registro en la base de datos
        const {
            username, 
            name,
            profile_picture 
        } = params

        let query = `INSERT INTO USUARIO (username, nombre, foto, modoBot) VALUES ('${username}', '${name}', '${profile_picture}', false)`

        return this.executeQuery(query, callback)
    },

    getCount(params, callback) {  // contador de publicaciones y amigos
        const {
            username
        } = params

        let query = `SELECT COUNT(p.idPublicacion) AS counts FROM PUBLICACION p
        WHERE p.usuario = '${username}'
        UNION
        SELECT COUNT(a.username) AS friends FROM (
        (SELECT username FROM USUARIO u, AMISTAD a
        WHERE a.usuario = '${username}' AND a.amigo = u.username AND a.estado = 1)
         UNION
        (SELECT username FROM USUARIO u, AMISTAD a
        WHERE a.usuario = u.username AND a.amigo = '${username}'  AND a.estado = 1)
        ) a;  `

        return this.executeQuery(query, callback)
    }, 

    getPhoto(params, callback){ // traer foto de perfil
        const {
            username
        } = params; 

        let query = `SELECT foto AS picture_profile FROM USUARIO WHERE username = '${username}'`

        return this.executeQuery(query, callback)
    }, 

    update(params, callback){  // actualizar
        const {
            new_username, 
            username, 
            name, 
            profile_picture, 
            bot_mode
        } = params; 

        let query = `UPDATE USUARIO 
        SET username = '${new_username}', nombre = '${name}' , foto = '${profile_picture}', modoBot = ${bot_mode}
        WHERE username = '${username}'`

        return this.executeQuery(query, callback)
    }
}

module.exports = userModel