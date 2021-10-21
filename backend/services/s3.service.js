const AWS = require('aws-sdk')
const s3_credentials = require('../config/s3.credentials')
const { v4: uuidv4 } = require('uuid')
const S3 = new AWS.S3(s3_credentials)

const s3Service = {
    uploadPhoto(req, folder) {
        let ruta  
        if(folder == 'profile'){  // profile
            ruta = `profile/${req.username}-${uuidv4()}${req.extension}`
        }else{  // post 
            ruta = `posts/post-${uuidv4()}${req.extension}`
        }
        let buffer = new Buffer.from(req.image, 'base64');
        req.image = ruta

        const params = {
            Bucket: 'proyecto2-39-semi1',
            Key: ruta,
            Body: buffer,
            ContentType: 'image',
            ACL: 'public-read'
        }; 

        S3.putObject(params).promise();
        console.log()
        return req
    }, 
    
    delete(url) {
        const params = {
            Bucket: 'proyecto2-39-semi1',
            Key: url
        }
        S3.deleteObject(params, function(err, data){
            if(err){
                console.log('Delete failed - S3')
                return
            }
            console.log('Deleted Successfully')
        })
    }
}

module.exports = s3Service