const { validatePlantDto } = require("../dtos/plant.dto");

const {
  getHomeData,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  markPlantWatered,
} = require("../services/plant.service");

const getUploadedImagePath = (file) => {
  if (!file) {
    return "";
  }

  return `/uploads/plants/${file.filename}`;
};

const showHome = async (req, res) => {
  try {
    const { plants, needWateringPlants, stats } = await getHomeData(
      req.session.user.id
    );

    res.render("home", {
      title: "Home",
      user: req.session.user,
      plants,
      needWateringPlants,
      stats,
    });
  } catch (error) {
    console.error("Show home error:", error);
    res.redirect("/login");
  }
};

const showCreatePlantPage = (req, res) => {
  res.render("plants/create", {
    title: "Thêm cây",
    error: null,
    oldData: {},
  });
};

const createNewPlant = async (req, res) => {
  try {
    const validation = validatePlantDto(req.body);

    if (!validation.isValid) {
      return res.render("plants/create", {
        title: "Thêm cây",
        error: validation.message,
        oldData: req.body,
      });
    }

    const imagePath = getUploadedImagePath(req.file);

    await createPlant(req.session.user.id, validation.data, imagePath);

    res.redirect("/");
  } catch (error) {
    console.error("Create plant error:", error);

    res.render("plants/create", {
      title: "Thêm cây",
      error: "Có lỗi xảy ra khi thêm cây",
      oldData: req.body,
    });
  }
};

const showPlantDetail = async (req, res) => {
  try {
    const plant = await getPlantById(req.params.id, req.session.user.id);

    if (!plant) {
      return res.redirect("/");
    }

    res.render("plants/detail", {
      title: "Chi tiết cây",
      plant,
    });
  } catch (error) {
    console.error("Show plant detail error:", error);
    res.redirect("/");
  }
};

const showEditPlantPage = async (req, res) => {
  try {
    const plant = await getPlantById(req.params.id, req.session.user.id);

    if (!plant) {
      return res.redirect("/");
    }

    res.render("plants/edit", {
      title: "Sửa cây",
      error: null,
      plant,
    });
  } catch (error) {
    console.error("Show edit plant error:", error);
    res.redirect("/");
  }
};

const updatePlantInfo = async (req, res) => {
  try {
    const validation = validatePlantDto(req.body);

    if (!validation.isValid) {
      return res.render("plants/edit", {
        title: "Sửa cây",
        error: validation.message,
        plant: {
          ...req.body,
          _id: req.params.id,
          image: req.body.oldImage || "",
        },
      });
    }

    const imagePath = getUploadedImagePath(req.file);

    const plant = await updatePlant(
      req.params.id,
      req.session.user.id,
      validation.data,
      imagePath
    );

    if (!plant) {
      return res.redirect("/");
    }

    res.redirect(`/plants/${req.params.id}`);
  } catch (error) {
    console.error("Update plant error:", error);
    res.redirect("/");
  }
};

const deletePlantById = async (req, res) => {
  try {
    await deletePlant(req.params.id, req.session.user.id);
    res.redirect("/");
  } catch (error) {
    console.error("Delete plant error:", error);
    res.redirect("/");
  }
};

const markWatered = async (req, res) => {
  try {
    await markPlantWatered(req.params.id, req.session.user.id);

    const backUrl = req.get("Referrer") || "/";
    res.redirect(backUrl);
  } catch (error) {
    console.error("Mark watered error:", error);
    res.redirect("/");
  }
};

module.exports = {
  showHome,
  showCreatePlantPage,
  createNewPlant,
  showPlantDetail,
  showEditPlantPage,
  updatePlantInfo,
  deletePlantById,
  markWatered,
};