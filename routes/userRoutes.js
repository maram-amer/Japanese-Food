const express = require("express"),
  controller = require("../controllers/userController");
const router = express.Router();

router.route("/login").get(controller.getLogin).post(controller.postLogin);

router.route("/signup").get(controller.getSignup).post(controller.postSignup);

router.route("/aboutuser").get(controller.getAboutUser);

router.route("/signout").get(controller.signout);

module.exports = router;
