const { Router } = require('express');
const {
  getAllMissions,
  getMissionById,
  createMission,
  updateMission,
  deleteMission,
} = require('../controllers/missionsController');

const router = Router();

router.get('/', getAllMissions);
router.get('/:id', getMissionById);
router.post('/', createMission);
router.patch('/:id', updateMission);
router.delete('/:id', deleteMission);

module.exports = router;
