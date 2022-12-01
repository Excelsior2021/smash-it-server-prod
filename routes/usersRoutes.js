const router = require("express").Router();
const controller = require("../controllers/usersController");

router.get("/authenticate", controller.authenticate);

router.get("/", controller.getUsers);

router.get("/profile/:groupName/:username", controller.getProfileData);

router.post("/login", controller.login);

router.post("/create-account", controller.createAccount);

module.exports = router;
