const router = require("express").Router();
const controller = require("../controllers/groupsController");

router.get("/", controller.getAllGroups);

router.get("/:username", controller.getUserGroups);

router.get("/:groupName", controller.getGroup);

router.get("/members/:groupName", controller.getMembers);

router.post("/new", controller.addNewGroup);

router.post("/add", controller.addMemberToGroup);

router.delete("/remove-member", controller.removeMemberFromGroup);

module.exports = router;
