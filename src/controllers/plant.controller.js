const { validatePlantDto } = require("../dtos/plant.dto");

const {
  getPlantsByUser,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  markPlantWatered,
} = require("../services/plant.service");

const showPlantList = async (req, res) => {
  try {
    const plants = await getPlantsByUser(req.session.user.id);

    res.render("plants/index", {
      title: "Danh sách cây",
      plants,
    });
  } catch (error) {
    console.error("Show plant list error:", error);
    res.redirect("/dashboard");
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

    await createPlant(req.session.user.id, validation.data);

    res.redirect("/plants");
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
      return res.redirect("/plants");
    }

    res.render("plants/detail", {
      title: "Chi tiết cây",
      plant,
    });
  } catch (error) {
    console.error("Show plant detail error:", error);
    res.redirect("/plants");
  }
};

const showEditPlantPage = async (req, res) => {
  try {
    const plant = await getPlantById(req.params.id, req.session.user.id);

    if (!plant) {
      return res.redirect("/plants");
    }

    res.render("plants/edit", {
      title: "Sửa cây",
      error: null,
      plant,
    });
  } catch (error) {
    console.error("Show edit plant error:", error);
    res.redirect("/plants");
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
        },
      });
    }

    const plant = await updatePlant(
      req.params.id,
      req.session.user.id,
      validation.data
    );

    if (!plant) {
      return res.redirect("/plants");
    }

    res.redirect(`/plants/${req.params.id}`);
  } catch (error) {
    console.error("Update plant error:", error);
    res.redirect("/plants");
  }
};

const deletePlantById = async (req, res) => {
  try {
    await deletePlant(req.params.id, req.session.user.id);
    res.redirect("/plants");
  } catch (error) {
    console.error("Delete plant error:", error);
    res.redirect("/plants");
  }
};

const markWatered = async (req, res) => {
  try {
    await markPlantWatered(req.params.id, req.session.user.id);

    const backUrl = req.get("Referrer") || "/plants";
    res.redirect(backUrl);
  } catch (error) {
    console.error("Mark watered error:", error);
    res.redirect("/plants");
  }
};

module.exports = {
  showPlantList,
  showCreatePlantPage,
  createNewPlant,
  showPlantDetail,
  showEditPlantPage,
  updatePlantInfo,
  deletePlantById,
  markWatered,
};