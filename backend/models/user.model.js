const database = require('../database/database')

const userModel = {
    executeQuery(query, callback) {
        database.query(query, (err, res) => callback(err, res));
    },

    register(params, callback) {  // registro en la base de datos
        const {
            username
        } = params

        let query = `INSERT INTO USUARIO (username) VALUES ('${username}')`

        return this.executeQuery(query, callback)
    },

    getCount(params, callback) {  // contador de publicaciones y amigos
        const {
            username
        } = params

        let query = ``

        return this.executeQuery(query, callback)
    }
}

module.exports = userModel