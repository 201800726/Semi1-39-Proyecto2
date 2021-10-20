const translate_credentials = require('../config/translate.credentials')
const s3Service = require('../services/s3.service')
const rekognitionService = require('../services/rekognition.service')
const postModel = require('../models/post.model')
const AWS = require('aws-sdk')

const translate = new AWS.Translate(translate_credentials)

const postController = {
    create: (req, res) =>{
        let image = req.body.image
        req.body = s3Service.uploadPhoto(req.body, 'posts')
        postModel.create(req.body, (err, result) => {
            if (err) {
                res.status(500).send({
                    code: '500',
                    data: err
                });
                return
            }  
            res.status(200).send({
                code: '200',
                data: result
            });
            rekognitionService.getLabels(image, result.insertId)
        });
           
    },

    translate: (req, res) => {
        let params = {
            SourceLanguageCode: 'auto', 
            TargetLanguageCode: 'es', 
            Text: req.body.text 
        }; 

        translate.translateText(params, function(err, data){
            if(err){
                res.status(500).send({
                    code: '500', 
                    data: err
                }); 
                return 
            }
            res.status(200).send({
                code: '200', 
                data: data
            })
        })
    }, 

    filter: (req, res) => {
        postModel.filter(req.body, (err, result) => {
            if(err){
                res.status(500).send({
                    code: '500', 
                    data: err
                })
                return 
            }
            res.status(200).send({
                code: '200', 
                data: result
            })
        })
    }
}

module.exports = postController;