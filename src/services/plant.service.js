const Plant = require("../models/plant.model");

const getTodayRange = () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  return {
    todayStart,
    todayEnd,
  };
};

const parseDateInput = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + Number(days));
  result.setHours(0, 0, 0, 0);
  return result;
};

const getWateredTodayCount = (plant) => {
  const { todayStart, todayEnd } = getTodayRange();

  return (plant.wateringLogs || []).filter((log) => {
    const wateredAt = new Date(log.wateredAt);
    return wateredAt >= todayStart && wateredAt <= todayEnd;
  }).length;
};

const getLastWateredAt = (plant) => {
  const logs = plant.wateringLogs || [];

  if (logs.length === 0) {
    return null;
  }

  const sortedLogs = [...logs].sort((a, b) => {
    return new Date(b.wateredAt) - new Date(a.wateredAt);
  });

  return sortedLogs[0].wateredAt;
};

const addStatusToPlant = (plant) => {
  const { todayStart, todayEnd } = getTodayRange();

  const nextWateringAt = plant.nextWateringAt
    ? new Date(plant.nextWateringAt)
    : todayStart;

  const wateringTimesPerDay = Number(plant.wateringTimesPerDay || 1);
  const wateredTodayCount = getWateredTodayCount(plant);

  const isScheduledToday = nextWateringAt <= todayEnd;
  const isOverdue = nextWateringAt < todayStart;

  const requiredTodayCount =
    isScheduledToday || wateredTodayCount > 0 ? wateringTimesPerDay : 0;

  const remainingTodayCount = Math.max(
    requiredTodayCount - wateredTodayCount,
    0
  );

  const isCompletedToday =
    requiredTodayCount > 0 && remainingTodayCount === 0;

  let status = "upcoming";
  let statusText = "Chưa tới ngày tưới";
  let statusClass = "status-upcoming";

  if (isCompletedToday) {
    status = "completed";
    statusText = "Đã hoàn thành hôm nay";
    statusClass = "status-completed";
  } else if (isOverdue) {
    status = "overdue";
    statusText = "Quá hạn tưới";
    statusClass = "status-overdue";
  } else if (isScheduledToday) {
    status = "today";
    statusText = "Cần tưới hôm nay";
    statusClass = "status-today";
  }

  return {
    ...plant,
    status,
    statusText,
    statusClass,
    wateredTodayCount,
    requiredTodayCount,
    remainingTodayCount,
    isCompletedToday,
    lastWateredAt: getLastWateredAt(plant),
  };
};

const getPlantsByUser = async (userId) => {
  const plants = await Plant.find({ userId })
    .sort({ nextWateringAt: 1, createdAt: -1 })
    .lean();

  return plants.map(addStatusToPlant);
};

const getPlantById = async (plantId, userId) => {
  const plant = await Plant.findOne({
    _id: plantId,
    userId,
  }).lean();

  if (!plant) {
    return null;
  }

  return addStatusToPlant(plant);
};

const getHomeData = async (userId) => {
  const plants = await getPlantsByUser(userId);

  const needWateringPlants = plants.filter((plant) => {
    return plant.remainingTodayCount > 0;
  });

  const completedPlants = plants.filter((plant) => {
    return plant.isCompletedToday;
  });

  return {
    plants,
    needWateringPlants,
    stats: {
      totalPlants: plants.length,
      needWateringToday: needWateringPlants.length,
      completedToday: completedPlants.length,
    },
  };
};

const createPlant = async (userId, data, imagePath) => {
  const nextWateringDate = parseDateInput(data.nextWateringAt);

  return Plant.create({
    userId,
    name: data.name,
    type: data.type,
    location: data.location,
    image: imagePath || "",
    description: data.description,
    note: data.note,
    wateringTimesPerDay: data.wateringTimesPerDay,
    wateringIntervalDays: data.wateringIntervalDays,
    nextWateringAt: nextWateringDate,
    wateringLogs: [],
  });
};

const updatePlant = async (plantId, userId, data, imagePath) => {
  const plant = await Plant.findOne({
    _id: plantId,
    userId,
  });

  if (!plant) {
    return null;
  }

  plant.name = data.name;
  plant.type = data.type;
  plant.location = data.location;
  plant.description = data.description;
  plant.note = data.note;
  plant.wateringTimesPerDay = data.wateringTimesPerDay;
  plant.wateringIntervalDays = data.wateringIntervalDays;
  plant.nextWateringAt = parseDateInput(data.nextWateringAt);

  if (imagePath) {
    plant.image = imagePath;
  }

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

  const plantStatus = addStatusToPlant(plant.toObject());

  if (plantStatus.remainingTodayCount <= 0) {
    return plant;
  }

  const now = new Date();

  plant.wateringLogs.push({
    wateredAt: now,
  });

  const wateredTodayCount = getWateredTodayCount(plant);
  const wateringTimesPerDay = Number(plant.wateringTimesPerDay || 1);

  if (wateredTodayCount >= wateringTimesPerDay) {
    const { todayStart } = getTodayRange();

    plant.nextWateringAt = addDays(
      todayStart,
      Number(plant.wateringIntervalDays || 1)
    );
  }

  await plant.save();

  return plant;
};

module.exports = {
  getPlantsByUser,
  getPlantById,
  getHomeData,
  createPlant,
  updatePlant,
  deletePlant,
  markPlantWatered,
};