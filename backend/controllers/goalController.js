const Goal = require('../models/Goal');

exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.params.userId });
        if (!goals || goals.length === 0) {
            return res.status(404).json({ message: 'Aucun objectif trouvé pour cet utilisateur' });
        }
        res.json({ message: 'Liste des objectifs', data: goals });
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur', error: err });
    }
};

exports.addGoal = async (req, res) => {
    try {
        const { userId, dailyCalories, dailyProteins, dailyCarbs, dailyFats } = req.body;

        if (!userId || !dailyCalories || !dailyProteins || !dailyCarbs || !dailyFats) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }

        const newGoal = new Goal({ userId, dailyCalories, dailyProteins, dailyCarbs, dailyFats });
        const savedGoal = await newGoal.save();
        res.status(201).json({
            message: 'Objectif nutritionnel ajouté',
            data: savedGoal
        });
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur', error: err });
    }
};

const { calculateDailyTotals } = require('./mealController');

exports.compareGoalsWithMeals = async (req, res) => {
    const { userId } = req.params;

    try {
        const dailyTotals = await calculateDailyTotals(userId);
        const goals = await Goal.findOne({ userId });

        if (!goals) {
            return res.status(404).json({ message: 'Aucun objectif trouvé pour cet utilisateur' });
        }

        const comparison = {
            calories: dailyTotals.calories >= goals.dailyCalories,
            proteins: dailyTotals.proteins >= goals.dailyProteins,
            carbs: dailyTotals.carbs >= goals.dailyCarbs,
            fats: dailyTotals.fats >= goals.dailyFats
        };

        res.json({ dailyTotals, comparison });
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur', error: err });
    }
};