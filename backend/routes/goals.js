const express = require('express');
const { getGoals, addGoal } = require('../controllers/goalController');

const router = express.Router();

router.get('/', getGoals);
router.get('/:userId', getGoals);
router.post('/', addGoal);

module.exports = router;