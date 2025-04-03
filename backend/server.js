require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur MongoDB :', err));

app.get('/', (req, res) => res.send('CO'));

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

const mealRoutes = require('./routes/meals');
app.use('/meals', mealRoutes);

const goalRoutes = require('./routes/goals');
app.use('/goals', goalRoutes)

const mealController = require('./controllers/mealController');
app.get('/meals/totals/:userId', mealController.getDailyTotals);

app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));