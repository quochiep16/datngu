const validatePlantDto = (body) => {
  const name = body.name?.trim();
  const type = body.type?.trim() || "";
  const description = body.description?.trim() || "";
  const note = body.note?.trim() || "";
  const wateringFrequency = Number(body.wateringFrequency);
  const lastWateredAt = body.lastWateredAt;

  if (!name) {
    return {
      isValid: false,
      message: "Vui lòng nhập tên cây",
    };
  }

  if (!wateringFrequency || wateringFrequency <= 0) {
    return {
      isValid: false,
      message: "Tần suất tưới phải lớn hơn 0",
    };
  }

  return {
    isValid: true,
    data: {
      name,
      type,
      description,
      wateringFrequency,
      lastWateredAt,
      note,
    },
  };
};

module.exports = {
  validatePlantDto,
};