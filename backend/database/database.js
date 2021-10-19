const db_credentials = require('../config/db.credentials')
const mysql = require('mysql')

const connection = mysql.createConnection(db_credentials);

connection.connect(function (err) {
    if (err) {
        console.log('Failed Connection')
        throw err
    } else {
        console.log('Successfull Connection')
    }
});

module.exports = connection;