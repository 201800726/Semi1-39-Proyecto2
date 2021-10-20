const friendshipModel = require('../models/friendship.model')

const friendshipController = {

    create: (req, res) => {
        friendshipModel.create(req.body, (err, result) => {
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
        });
    }, 

    getRequests: (req, res) => {
        friendshipModel.getRequests(req.params, (err, result) => {
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
        });
    },

    update: (req, res) => {
        friendshipModel.update(req.body, (err, result) => {
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
        });
    },

    delete: (req, res) => {
        friendshipModel.delete(req.params, (err, result) => {
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
        });
    },

    getFriends: (req, res) => {
        friendshipModel.getFriends(req.params, (err, result) => {
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
        });
    },

    getNoFriends: (req, res) => {
        friendshipModel.getNoFriends(req.params, (err, result) => {
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
        });
    },
}

module.exports = friendshipController