const validatePlantDto = (body) => {
  const name = body.name?.trim();
  const type = body.type?.trim() || "";
  const location = body.location?.trim() || "";
  const description = body.description?.trim() || "";
  const note = body.note?.trim() || "";

  const wateringTimesPerDay = Number(body.wateringTimesPerDay);
  const wateringIntervalDays = Number(body.wateringIntervalDays);
  const nextWateringAt = body.nextWateringAt;

  if (!name) {
    return {
      isValid: false,
      message: "Vui lòng nhập tên cây",
    };
  }

  if (!wateringTimesPerDay || wateringTimesPerDay <= 0) {
    return {
      isValid: false,
      message: "Số lần tưới trong ngày phải lớn hơn 0",
    };
  }

  if (!wateringIntervalDays || wateringIntervalDays <= 0) {
    return {
      isValid: false,
      message: "Số ngày tưới phải lớn hơn 0",
    };
  }

  if (!nextWateringAt) {
    return {
      isValid: false,
      message: "Vui lòng chọn ngày bắt đầu tưới",
    };
  }

  return {
    isValid: true,
    data: {
      name,
      type,
      location,
      description,
      note,
      wateringTimesPerDay,
      wateringIntervalDays,
      nextWateringAt,
    },
  };
};

module.exports = {
  validatePlantDto,
};