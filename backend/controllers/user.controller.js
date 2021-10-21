const userModel = require("../models/user.model");
const s3Service = require("../services/s3.service");
const AWS = require("aws-sdk");
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const cognito_credentials = require("../config/cognito.credentials");

const crypto = require("crypto");

const cognito = new AmazonCognitoIdentity.CognitoUserPool(cognito_credentials);
let cognitoUser;

const userController = {
  register: (req, res) => {
    let attributeList = [];

    let dataName = {
      Name: "name",
      Value: req.body.name,
    };
    let attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(
      dataName
    );
    attributeList.push(attributeName);

    let dataEmail = {
      Name: "email",
      Value: req.body.email,
    };
    let attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(
      dataEmail
    );
    attributeList.push(attributeEmail);

    let dataNickname = {
      Name: "nickname",
      Value: req.body.username,
    };
    let attributeNickname = new AmazonCognitoIdentity.CognitoUserAttribute(
      dataNickname
    );
    attributeList.push(attributeNickname);

    let dataModoBot = {
      Name: "custom:modoBot",
      Value: "0",
    };
    let attributeModoBot = new AmazonCognitoIdentity.CognitoUserAttribute(
      dataModoBot
    );
    attributeList.push(attributeModoBot);

    req.body = s3Service.uploadPhoto(req.body, "profile");

    let dataPicture = {
      Name: "picture",
      Value: req.body.image,
    };
    let attributePicture = new AmazonCognitoIdentity.CognitoUserAttribute(
      dataPicture
    );
    attributeList.push(attributePicture);

    let hash = crypto
      .createHash("sha256")
      .update(req.body.password)
      .digest("hex");

    cognito.signUp(
      req.body.username,
      `${hash}D**`,
      attributeList,
      null,
      async (err, data) => {
        if (err) {
          res.status(500).send({
            code: "500",
            data: err,
          });
          return;
        } else {
          console.log(data);
          userModel.register(req.body, (err, result) => {
            if (err) {
              res.status(500).send({
                code: "500",
                data: err,
              });
              return;
            }

            res.status(200).send({
              code: "200",
              data: result,
              message: "Your account has been created successfully",
            });
          });
        }
      }
    );
  },

  login: (req, res) => {
    let hash = crypto
      .createHash("sha256")
      .update(req.body.password)
      .digest("hex");
    let authentication = {
      Username: req.body.username,
      Password: `${hash}D**`,
    };

    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authentication
    );

    let userData = {
      Username: req.body.username,
      Pool: cognito,
    };

    cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.setAuthenticationFlowType("USER_PASSWORD_AUTH");

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        userModel.login(req.body, (err, result) => {
          if (err) {
            res.status(500).send({
              code: "500",
              data: err,
            });
            return;
          }
          res.status(200).send({
            code: "200",
            data: result,
          });
        });
      },
      onFailure: function (err) {
        res.status(500).send({
          code: "500",
          data: err,
        });
        return;
      },
    });
  },

  updateCognito: (req, res) => {
    let hash = crypto
      .createHash("sha256")
      .update(req.body.password)
      .digest("hex");
    let authentication = {
      Username: req.body.username,
      Password: `${hash}D**`,
    };

    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authentication
    );

    let userData = {
      Username: req.body.username,
      Pool: cognito,
    };

    cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.setAuthenticationFlowType("USER_PASSWORD_AUTH");

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        var accessToken = result.getAccessToken().getJwtToken();
        AWS.config.region = "us-east-2";
        var cognitoIdentity = new AWS.CognitoIdentityServiceProvider();
        s3Service.delete(req.body.route);
        req.body = s3Service.uploadPhoto(req.body, "profile");
        var params = {
          AccessToken: accessToken,
          UserAttributes: [
            {
              Name: "name",
              Value: req.body.name,
            },
            {
              Name: "picture",
              Value: req.body.image,
            },
            {
              Name: "custom:modoBot",
              Value: `${req.body.bot_mode}`,
            },
          ],
        };

        cognitoIdentity.updateUserAttributes(params, function (err, data) {
          if (err) {
            console.log(err);
            res.status(500).send({
              code: "500",
              data: err,
            });
            return;
          }
          userModel.update(req.body, (err, result) => {
            if (err) {
              console.log(err);
              res.status(500).send({
                code: "500",
                data: err,
              });
              return;
            }

            res.status(200).send({
              code: "200",
              data: result,
            });
          });
        });
      },
      onFailure: function (err) {
        console.log(err);
        res.status(500).send({
          code: "500",
          data: err,
        });
        return;
      },
    });
  },

  getCounters: (req, res) => {
    userModel.getCounters(req.params, (err, result) => {
      if (err) {
        res.status(500).send({
          code: "500",
          data: err,
        });
        return;
      }

      let data = {
        posts: result[0] ? result[0].counter : 0,
        friends: result[1] ? result[1].counter : 0,
      };

      res.status(200).send({
        code: "200",
        data: data,
      });
    });
  },

  getPhoto: (req, res) => {
    userModel.getPhoto(req.params, (err, result) => {
      if (err) {
        res.status(500).send({
          code: "500",
          data: err,
        });
        return;
      }

      res.status(200).send({
        code: "200",
        data: result[0],
      });
    });
  },

  update: (req, res) => {
    userModel.update(req.body, (err, result) => {
      if (err) {
        res.status(500).send({
          code: "500",
          data: err,
        });
        return;
      }

      res.status(200).send({
        code: "200",
        data: result,
      });
    });
  },
};

module.exports = userController;
