const db = require('../database/database')

const friendshipModel = {
    executeQuery(query, callback) {
        db.query(query, (err, res) => callback(err, res));
    },

    sendFriendRequest(params, callback) {
        const {
            user,
            friend
        } = params

        let query = `INSERT INTO SOLICITUD (usuario, amigo, estado) 
        VALUES ('${user}', '${friend}', false)`

        return this.executeQuery(query, callback)
    },

    create(params, callback) {
        const {
            user,
            friend
        } = params;

        let query = `INSERT INTO AMISTAD (usuario, amigo) 
        VALUES ('${user}', '${friend}'); 

        INSERT INTO AMISTAD (usuario, amigo) 
        VALUES ('${friend}', '${user}' ); `

        return this.executeQuery(query, callback)
    }
}

module.exports = friendshipModel;