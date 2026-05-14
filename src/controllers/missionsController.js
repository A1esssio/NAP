const missionsService = require("../services/missionsService");

function getAllMissions(req, res, next) {
  try {
    const { mission_name } = req.query;
    const missions = missionsService.findAll(mission_name);
    res.json(missions);
  } catch (err) {
    next(err);
  }
}

function getMissionById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID должен быть числом" });
    }
    const mission = missionsService.findOne(id);
    if (!mission) {
      return res.status(404).json({ error: `Миссия с ID ${id} не найдена` });
    }
    res.json(mission);
  } catch (err) {
    next(err);
  }
}

function getMissionByDescription(req, res, next) {
  try {
    const description = (req.params.description || "").trim();
    if (!description) {
      return res.status(400).json({ error: "Описание не может быть пустым" });
    }

    const matches = missionsService.findByDescription(description);
    if (!matches || matches.length === 0) {
      return res
        .status(404)
        .json({ error: `Миссия с описанием "${description}" не найдена` });
    }

    return res.json(matches[0]);
  } catch (err) {
    next(err);
  }
}

function createMission(req, res, next) {
  try {
    const { image, mission_name, description } = req.body;
    if (!image || !mission_name || !description) {
      return res.status(400).json({
        error: "Поля image, mission_name и description обязательны",
      });
    }
    const newMission = missionsService.create({
      image,
      mission_name,
      description,
    });
    res.status(201).json(newMission);
  } catch (err) {
    next(err);
  }
}

function updateMission(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID должен быть числом" });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ error: "Тело запроса не должно быть пустым" });
    }
    const updated = missionsService.update(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: `Миссия с ID ${id} не найдена` });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

function deleteMission(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID должен быть числом" });
    }
    const deleted = missionsService.remove(id);
    if (!deleted) {
      return res.status(404).json({ error: `Миссия с ID ${id} не найдена` });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllMissions,
  getMissionById,
  getMissionByDescription,
  createMission,
  updateMission,
  deleteMission,
};
