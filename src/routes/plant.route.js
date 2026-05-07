const express = require("express");
const plantController = require("../controllers/plant.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
const { uploadPlantImage } = require("../middlewares/upload.middleware");

const router = express.Router();

router.use(requireAuth);

router.get("/", plantController.showHome);

router.get("/create", plantController.showCreatePlantPage);

router.post(
  "/create",
  uploadPlantImage.single("image"),
  plantController.createNewPlant
);

router.get("/:id", plantController.showPlantDetail);

router.get("/:id/edit", plantController.showEditPlantPage);

router.post(
  "/:id/edit",
  uploadPlantImage.single("image"),
  plantController.updatePlantInfo
);

router.post("/:id/delete", plantController.deletePlantById);

router.post("/:id/watered", plantController.markWatered);

module.exports = router;