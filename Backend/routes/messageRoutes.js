const express = require("express");
const { SendMessage, AllMessages } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");
const router= express.Router();


router.route("/:chatTd").get(protect,AllMessages)
router.route("/").post(protect,SendMessage);

module.exports=router