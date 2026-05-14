const { Router } = require("express");
const {
  getAllMissions,
  getMissionById,
  getMissionByDescription,
  createMission,
  updateMission,
  deleteMission,
} = require("../controllers/missionsController");

const router = Router();

router.get("/", getAllMissions);
router.get("/description/:description", getMissionByDescription);
router.get("/:id", getMissionById);
router.post("/", createMission);
router.patch("/:id", updateMission);
router.delete("/:id", deleteMission);

module.exports = router;
