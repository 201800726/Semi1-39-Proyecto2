const db = require('../database/database')

const postModel = {
    executeQuery(query, callback){
        db.query(query, (err, res) => callback(err, res)); 
    }, 

    create(params, callback){  // crear publicaciones
        const {
            text, 
            image, 
            username
        } = params; 

        let query = `INSERT INTO PUBLICACION (texto, imagen, usuario) 
        VALUES ('${text}', '${image}', '${username}')`

        return this.executeQuery(query, callback)
    }, 

    createLabel(label, post){  // crear etiquetas
        let query = `INSERT INTO ETIQUETA (etiqueta, publicacion) VALUES ('${label}', ${post})`
        db.query(query, (err, res) => {
            if(err){
                console.log('ERROR AL INSERTAR ETIQUETA')
                console.log(err)
                return
            }     
        })
    }, 

    filter(params, callback){ // filtrar por lista de etiquetas
        let labels = params.labels
        let stringL = ''

        for(let i = 0; i < labels.length; i++){
            let label = labels[i]
            if(i === 0){
                stringL = `etiqueta = '${label}'`
            }else{
                stringL += `OR etiqueta = '${label}'`
            }
        }
        
        let query = `SELECT p.* FROM PUBLICACION p, 
        (
            SELECT distinct publicacion FROM ETIQUETA 
            WHERE ${stringL}
        ) a
        WHERE a.publicacion = p.idPublicacion `

        return this.executeQuery(query, callback)
    }, 

    getLabels( callback){ // traer etiquetas 
        let query = `SELECT DISTINCT etiqueta FROM ETIQUETA`

        return this.executeQuery(query, callback)
    }

}

module.exports = postModel