const router = require("express").Router();
const controller = require("../controllers/statsController");

router.get("/:groupName", controller.getGroupStats);

router.put("/update-stats", controller.updateStats);

module.exports = router;
