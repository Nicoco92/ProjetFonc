const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
    userId: { type: String, required: true }, 
    dailyCalories: { type: Number, required: true },
    dailyProteins: { type: Number, required: true },
    dailyCarbs: { type: Number, required: true },
    dailyFats: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Goal', GoalSchema);