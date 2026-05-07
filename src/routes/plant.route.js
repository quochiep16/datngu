const express = require("express");
const plantController = require("../controllers/plant.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.get("/", plantController.showPlantList);

router.get("/create", plantController.showCreatePlantPage);
router.post("/create", plantController.createNewPlant);

router.get("/:id", plantController.showPlantDetail);

router.get("/:id/edit", plantController.showEditPlantPage);
router.post("/:id/edit", plantController.updatePlantInfo);

router.post("/:id/delete", plantController.deletePlantById);

router.post("/:id/watered", plantController.markWatered);

module.exports = router;