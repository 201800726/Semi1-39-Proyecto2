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
        
        let query = `SELECT b.idPublicacion AS idPost, b.fecha AS date, b.texto AS text, b.imagen AS image, b.usuario AS user , 
        us.foto AS profile_picture  FROM USUARIO us,
        (SELECT p.* FROM PUBLICACION p
        INNER JOIN ((select username from USUARIO u, AMISTAD a
                    where a.usuario = '${username}' and a.amigo = u.username and a.estado = 1)
                    UNION
                    (select username from USUARIO u, AMISTAD a
                    where a.usuario = u.username and a.amigo = '${username}'  and a.estado = 1)) a ON a.username = p.usuario 
        UNION 
        SELECT p.* FROM PUBLICACION p 
        WHERE p.usuario = '${username}'
        )b, 
        (
            SELECT distinct publicacion FROM ETIQUETA 
            WHERE ${stringL}
        )c
        WHERE c.publicacion = b.idPublicacion AND us.username = b.usuario
        ORDER BY b.fecha DESC  `

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

        let query = `SELECT b.idPublicacion AS idPost, b.fecha AS date, b.texto AS text, b.imagen AS image, b.usuario AS user , us.foto AS profile_picture  FROM USUARIO us, 
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
        WHERE b.usuario = us.username
        ORDER BY b.fecha DESC; `

        return this.executeQuery(query, callback)
    }

}

module.exports = postModel