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

    createLabel(label, post){    // crear etiquetas
        let query = `INSERT INTO ETIQUETA (etiqueta, publicacion) VALUES ('${label}', ${post})`
        db.query(query, (err, res) => {
            if(err){
                console.log('ERROR AL INSERTAR ETIQUETA')
                console.log(err)
                return
            }     
        })
    }, 

    filter(params, callback){   // filtrar por lista de etiquetas   
        const {
            labels, 
            username
        } = params
        let stringL = ''

        for(let i = 0; i < labels.length; i++){
            let label = labels[i]
            if(i === 0){
                stringL = `etiqueta = '${label}'`
            }else{
                stringL += `OR etiqueta = '${label}'`
            }
        }
        
        let query = `SELECT DISTINCT a.idPublicacion AS idPost, a.fecha AS date, a.texto AS texto, 
        a.imagen AS image, a.usuario AS user FROM 
        (
            SELECT  p.* FROM PUBLICACION p
            INNER JOIN USUARIO u ON u.username = p.usuario
            INNER JOIN AMISTAD a ON a.usuario = u.username OR a.amigo = u.username
            WHERE a.usuario = '${username}' OR a.amigo = '${username}' AND a.estado = 1
        )a, 
        (
            SELECT distinct publicacion FROM ETIQUETA 
            WHERE ${stringL}
        )b
        WHERE b.publicacion = a.idPublicacion; `

        return this.executeQuery(query, callback)
    }, 

    getLabels(callback){ // traer etiquetas 
        let query = `SELECT DISTINCT etiqueta AS label FROM ETIQUETA`

        return this.executeQuery(query, callback)
    }, 

    getPost(params, callback){  // traer todas las publicaciones
        const {
            username 
        } = params

        let query = `SELECT b.* FROM 
        (SELECT p.* FROM PUBLICACION p
        INNER JOIN ((select username from USUARIO u, AMISTAD a
                    where a.usuario = '${username}' and a.amigo = u.username and a.estado = 1)
                    UNION
                    (select username from USUARIO u, AMISTAD a
                    where a.usuario = u.username and a.amigo = '${username}'  and a.estado = 1)) a ON a.username = p.usuario 
        UNION 
        SELECT p.* FROM PUBLICACION p 
        WHERE p.usuario = '${username}'
        )b
        ORDER BY b.fecha DESC; `

        return this.executeQuery(query, callback)
    }

}

module.exports = postModel