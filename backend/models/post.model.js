const db = require('../database/database')

const postModel = {
    executeQuery(query, callback){
        db.query(query, (err, res) => callback(err, res)); 
    }, 

    create(params, callback){
        const {
            text, 
            image, 
            username
        } = params; 

        let query = `INSERT INTO PUBLICACION (texto, imagen, usuario) 
        VALUES ('${text}', '${image}', '${username}')`

        return this.executeQuery(query, callback)
    }, 

    createLabel(label, post){
        let query = `INSERT INTO ETIQUETA (etiqueta, publicacion) VALUES ('${label}', ${post})`
        db.query(query, (err, res) => {
            if(err){
                console.log('ERROR AL INSERTAR ETIQUETA')
                console.log(err)
                return
            }    
            console.log('Etiqueta insertada')        
        })
    }, 

    filter(params, callback){
        const {

        } = params; 
        let query = `SELECT `

        return this.executeQuery(query, callback)
    }

}

module.exports = postModel