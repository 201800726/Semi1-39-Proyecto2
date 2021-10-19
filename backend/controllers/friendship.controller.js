const friendshipModel = require('../models/friendship.model')

const friendshipController = {
    sendFriendRequest: (req, res) => {
        friendshipModel.sendFriendRequest(req.body, (err, result) => {
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
    }
}

module.exports = friendshipController