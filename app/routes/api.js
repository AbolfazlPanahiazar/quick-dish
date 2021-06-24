const router = require("express").Router();
const RestaurantRoutes = require("./RestauranRoutes");

router.use("/restaurant", RestaurantRoutes);

module.exports = router;