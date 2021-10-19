const userModel = require('../models/user.model')
const s3Service = require('../services/s3.service')
const AmazonCognitoIdentity = require('amazon-cognito-identity-js')
const cognito_credentials = require('../config/cognito.credentials')

const crypto = require('crypto')

const cognito = new AmazonCognitoIdentity.CognitoUserPool(cognito_credentials);
let cognitoUser


const userController = {
    register: (req, res) => {
        let attributeList = []

        let dataName = {
            Name: 'name',
            Value: req.body.name,
        };
        let attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(dataName)
        attributeList.push(attributeName)

        let dataEmail = {
            Name: 'email',
            Value: req.body.email
        };
        let attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail)
        attributeList.push(attributeEmail)

        let dataNickname = {
            Name: 'nickname',
            Value: req.body.username
        }
        let attributeNickname = new AmazonCognitoIdentity.CognitoUserAttribute(dataNickname)
        attributeList.push(attributeNickname)

        let dataModoBot = {
            Name: 'custom:modoBot',
            Value: '0'
        }
        let attributeModoBot = new AmazonCognitoIdentity.CognitoUserAttribute(dataModoBot)
        attributeList.push(attributeModoBot)

        req.body = s3Service.uploadPhoto(req.body, 'profile')

        let dataPicture = {
            Name: 'picture',
            Value: req.body.image
        }
        let attributePicture = new AmazonCognitoIdentity.CognitoUserAttribute(dataPicture)
        attributeList.push(attributePicture)

        let hash = crypto.createHash('sha256').update(req.body.password).digest('hex');

        console.log(attributeList)

        cognito.signUp(req.body.username, `${hash}D**`, attributeList, null, async (err, data) => {
            if (err) {
                res.status(500).send({
                    code: '500',
                    data: err
                });
                return
            } else {
                console.log(data)
                userModel.register(req.body, (err, result) => {
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
                    })
                })
            }
        })
    },

    login: (req, res) => {
        let hash = crypto.createHash('sha256').update(req.body.password).digest('hex')
        let authentication = {
            Username: req.body.username,
            Password: `${hash}D**`
        };

        let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authentication)

        let userData = {
            Username: req.body.username,
            Pool: cognito
        }

        cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.setAuthenticationFlowType('USER_PASSWORD_AUTH')

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                res.status(200).send({
                    code: '200',
                    data: result
                })
                return
            },
            onFailure: function (err) {
                res.status(500).send({
                    code: '500',
                    data: err
                });
                return
            }
        });


    },

    update: (req, res) => {
        
    }

 }

module.exports = userController