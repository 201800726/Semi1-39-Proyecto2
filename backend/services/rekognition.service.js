const rekognition_credentials = require('../config/rekognition.credentials')
const postModel = require('../models/post.model')
const AWS = require('aws-sdk')

let rekognition = new AWS.Rekognition(rekognition_credentials)

let rekognitionService = {
    async getLabels(image, post) {
        let params = {
            Image: { 
                Bytes: Buffer.from(image, 'base64')
            }, 
            MaxLabels: 123
        };
        rekognition.detectLabels(params, function (err, data) {
            if (err) { 
                console.error(err)
                return
            }
            data.Labels.forEach(element => {
                postModel.createLabel(element.Name, post)
            })
        });
    }
}

module.exports = rekognitionService