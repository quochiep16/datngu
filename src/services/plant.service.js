const Plant = require("../models/plant.model");

const calculateNextWateringDate = (lastWateredAt, wateringFrequency) => {
  const baseDate = lastWateredAt ? new Date(lastWateredAt) : new Date();
  const nextDate = new Date(baseDate);

  nextDate.setDate(nextDate.getDate() + Number(wateringFrequency));

  return nextDate;
};

const getPlantStatus = (plant) => {
  if (!plant.nextWateringAt) {
    return {
      status: "unknown",
      text: "Chưa có lịch",
      className: "status-unknown",
    };
  }

  const nextWateringDate = new Date(plant.nextWateringAt);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  if (nextWateringDate < todayStart) {
    return {
      status: "overdue",
      text: "Quá hạn tưới",
      className: "status-overdue",
    };
  }

  if (nextWateringDate <= todayEnd) {
    return {
      status: "today",
      text: "Cần tưới hôm nay",
      className: "status-today",
    };
  }

  return {
    status: "upcoming",
    text: "Chưa tới ngày tưới",
    className: "status-upcoming",
  };
};

const getPlantsByUser = async (userId) => {
  const plants = await Plant.find({ userId })
    .sort({ nextWateringAt: 1, createdAt: -1 })
    .lean();

  return plants.map((plant) => {
    const statusInfo = getPlantStatus(plant);

    return {
      ...plant,
      status: statusInfo.status,
      statusText: statusInfo.text,
      statusClass: statusInfo.className,
    };
  });
};

const getPlantById = async (plantId, userId) => {
  const plant = await Plant.findOne({
    _id: plantId,
    userId,
  }).lean();

  if (!plant) {
    return null;
  }

  const statusInfo = getPlantStatus(plant);

  return {
    ...plant,
    status: statusInfo.status,
    statusText: statusInfo.text,
    statusClass: statusInfo.className,
  };
};

const createPlant = async (userId, data) => {
  const lastWateredDate = data.lastWateredAt
    ? new Date(data.lastWateredAt)
    : new Date();

  const nextWateringDate = calculateNextWateringDate(
    lastWateredDate,
    data.wateringFrequency
  );

  const plant = await Plant.create({
    userId,
    name: data.name,
    type: data.type,
    description: data.description,
    wateringFrequency: data.wateringFrequency,
    lastWateredAt: lastWateredDate,
    nextWateringAt: nextWateringDate,
    note: data.note,
  });

  return plant;
};

const updatePlant = async (plantId, userId, data) => {
  const plant = await Plant.findOne({
    _id: plantId,
    userId,
  });

  if (!plant) {
    return null;
  }

  const lastWateredDate = data.lastWateredAt
    ? new Date(data.lastWateredAt)
    : plant.lastWateredAt;

  const nextWateringDate = calculateNextWateringDate(
    lastWateredDate,
    data.wateringFrequency
  );

  plant.name = data.name;
  plant.type = data.type;
  plant.description = data.description;
  plant.wateringFrequency = data.wateringFrequency;
  plant.lastWateredAt = lastWateredDate;
  plant.nextWateringAt = nextWateringDate;
  plant.note = data.note;

  await plant.save();

  return plant;
};

const deletePlant = async (plantId, userId) => {
  return Plant.findOneAndDelete({
    _id: plantId,
    userId,
  });
};

const markPlantWatered = async (plantId, userId) => {
  const plant = await Plant.findOne({
    _id: plantId,
    userId,
  });

  if (!plant) {
    return null;
  }

  const now = new Date();

  plant.lastWateredAt = now;
  plant.nextWateringAt = calculateNextWateringDate(
    now,
    plant.wateringFrequency
  );

  await plant.save();

  return plant;
};

const getPlantStats = async (userId) => {
  const plants = await Plant.find({ userId }).lean();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const totalPlants = plants.length;

  const needWatering = plants.filter((plant) => {
    return plant.nextWateringAt && new Date(plant.nextWateringAt) <= todayEnd;
  }).length;

  const overdue = plants.filter((plant) => {
    return plant.nextWateringAt && new Date(plant.nextWateringAt) < todayStart;
  }).length;

  const wateredToday = plants.filter((plant) => {
    return plant.lastWateredAt && new Date(plant.lastWateredAt) >= todayStart;
  }).length;

  return {
    totalPlants,
    needWatering,
    overdue,
    wateredToday,
  };
};

module.exports = {
  getPlantsByUser,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  markPlantWatered,
  getPlantStats,
};