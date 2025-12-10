const express = require('express');
const { Competition, Score } = require('../models');
const { authRequired, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Create competition (admin general)
router.post('/', authRequired, requireRole('ADMIN_GENERAL'), async (req, res) => {
    try {
        const { title, description, startTime, endTime } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'title is required' });
        }

        const competition = await Competition.create({
            title,
            description: description || null,
            startTime: startTime ? new Date(startTime) : null,
            endTime: endTime ? new Date(endTime) : null,
            status: 'PLANNED',
        });

        return res.status(201).json(competition);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Get competition details
router.get('/:id', authRequired, async (req, res) => {
    try {
        const competition = await Competition.findByPk(req.params.id);
        if (!competition) {
            return res.status(404).json({ message: 'Competition not found' });
        }
        return res.json(competition);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Start competition
router.post('/:id/start', authRequired, requireRole('ADMIN_GENERAL'), async (req, res) => {
    try {
        const competition = await Competition.findByPk(req.params.id);
        if (!competition) {
            return res.status(404).json({ message: 'Competition not found' });
        }

        const now = new Date();
        const durationMinutes = Number(req.body.durationMinutes) || 60;
        const startTime = competition.startTime || now;
        const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

        competition.startTime = startTime;
        competition.endTime = endTime;
        competition.status = 'RUNNING';
        await competition.save();

        const io = req.app.get('io');
        io.to(`competition_${competition.id}`).emit('competition_started', {
            id: competition.id,
            startTime: competition.startTime,
            endTime: competition.endTime,
            status: competition.status,
        });

        return res.json(competition);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Finish competition
router.post('/:id/finish', authRequired, requireRole('ADMIN_GENERAL'), async (req, res) => {
    try {
        const competition = await Competition.findByPk(req.params.id);
        if (!competition) {
            return res.status(404).json({ message: 'Competition not found' });
        }

        competition.status = 'FINISHED';
        competition.endTime = competition.endTime || new Date();
        await competition.save();

        const io = req.app.get('io');
        io.to(`competition_${competition.id}`).emit('competition_finished', {
            id: competition.id,
            endTime: competition.endTime,
            status: competition.status,
        });

        return res.json(competition);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Leaderboard
router.get('/:id/leaderboard', authRequired, async (req, res) => {
    try {
        const competitionId = req.params.id;

        const scores = await Score.findAll({
            where: { competitionId },
            include: [
                {
                    association: 'user',
                    attributes: ['id', 'username'],
                },
            ],
            order: [['totalPoints', 'DESC']],
        });

        const formatted = scores.map((s) => ({
            userId: s.userId,
            username: s.user.username,
            totalPoints: s.totalPoints,
        }));

        return res.json(formatted);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
