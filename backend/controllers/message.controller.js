const MessageModel = require("../models/message.model");

const MessageController = {
  get: (req, res) => {
    MessageModel.get(req.body, (err, result) => {
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

module.exports = MessageController;
