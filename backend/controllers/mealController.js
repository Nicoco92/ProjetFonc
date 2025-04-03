const Meal = require('../models/Meal');

exports.getMeals = async (req, res) => {
    try {
        const meals = await Meal.find({ userId: req.params.userId });
        res.json({ message: 'Liste des repas', data: meals });
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur', error: err });
    }
};

exports.addMeal = async (req, res) => {
    try {
        const { userId, name, calories, proteins, carbs, fats } = req.body;

        if (!userId || !name || !calories || !proteins || !carbs || !fats) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }

        const newMeal = new Meal({ userId, name, calories, proteins, carbs, fats });
        const savedMeal = await newMeal.save();
        res.status(201).json({
            message: 'Repas ajouté',
            data: savedMeal
        });
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur', error: err });
    }
};

exports.calculateDailyTotals = async (userId) => {
    try {
        const meals = await Meal.find({ userId: userId });

        const dailyTotals = meals.reduce((totals, meal) => {
            totals.calories += meal.calories;
            totals.proteins += meal.proteins;
            totals.carbs += meal.carbs;
            totals.fats += meal.fats;
            return totals;
        }, {
            calories: 0,
            proteins: 0,
            carbs: 0,
            fats: 0
        });

        return dailyTotals;
    } catch (err) {
        throw new Error('Erreur de calcul des totaux journaliers');
    }
};

exports.getDailyTotals = async (req, res) => {
    try {
        const userId = req.params.userId;
        const dailyTotals = await exports.calculateDailyTotals(userId);
        res.json(dailyTotals); 
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur lors du calcul des totaux journaliers', error: err });
    }
};