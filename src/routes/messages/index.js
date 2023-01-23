const { sendMessage } = require("../../controllers/messages");
const { verifyToken } = require("../../middlewares");

const router = require("express").Router();

router.post("/chat", verifyToken, sendMessage);

module.exports = router;
