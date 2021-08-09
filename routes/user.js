const express = require('express');
const router = express.Router();
const controller = require("../controllers/userController");
const auth = require("../middlewares/auth");

router.get("/:id", auth, controller.getUser);
router.post("/signup", controller.userSignup);
router.post("/login", controller.userLogin);
router.put("/:id", auth, controller.userUpdate);
router.delete("/:id", auth, controller.userDelete);

module.exports = router;
