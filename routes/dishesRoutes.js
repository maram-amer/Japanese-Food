const express = require("express"),
  controller = require("../controllers/dishesController");
const router = express.Router();

router.route(["/", "/home"]).get(controller.getHome);

router.route("/details").get(controller.getDetails);

router.route("/like").post(controller.postLike);

router.route("/comment").post(controller.postComment);

module.exports = router;
