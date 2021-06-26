const router = require("express").Router();
const controller = require("../http/controller/RestaurantController");

router.get("/", controller.getList);
router.get("/:id", controller.getOne);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

router.post("/login", controller.login);

module.exports = router;