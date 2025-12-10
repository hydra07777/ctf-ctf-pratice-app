require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth.routes');
const challengeRoutes = require('./routes/challenge.routes');
const competitionRoutes = require('./routes/competition.routes');
const submissionRoutes = require('./routes/submission.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

// Static files for uploaded CTF zips
app.use('/uploads', express.static('uploads'));

// Basic health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/challenges', challengeRoutes);
app.use('/competitions', competitionRoutes);
app.use('/submissions', submissionRoutes);

// Sync database on startup (for dev)
async function initDatabase() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Database connected and models synchronized');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

initDatabase();

module.exports = app;
