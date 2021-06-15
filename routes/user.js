const express = require('express');
const router = express.Router();
const controller = require("../controllers/userController");

router.get("/:id", controller.getUser);
router.post("/signup", controller.userSignup);
router.post("/login", controller.userLogin);
router.put("/:id", controller.userUpdate);
router.delete("/:id", controller.userDelete);

module.exports = router;
