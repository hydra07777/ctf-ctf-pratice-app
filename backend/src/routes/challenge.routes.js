const express = require('express');
const { CTFChallenge, Competition } = require('../models');
const { authRequired, requireRole } = require('../middleware/auth.middleware');
const { ctfUpload } = require('../config/multer');

const router = express.Router();

// Create a new CTF challenge (participant uploads)
router.post(
    '/',
    authRequired,
    requireRole('PARTICIPANT'),
    ctfUpload.single('zipFile'),
    async (req, res) => {
        try {
            const { title, description, points, expectedFlag, competitionId } = req.body;

            if (!title || !description || !expectedFlag) {
                return res.status(400).json({ message: 'title, description and expectedFlag are required' });
            }

            if (!req.file) {
                return res.status(400).json({ message: 'zipFile is required' });
            }

            let competition = null;
            if (competitionId) {
                competition = await Competition.findByPk(competitionId);
                if (!competition) {
                    return res.status(404).json({ message: 'Competition not found' });
                }
            }

            const challenge = await CTFChallenge.create({
                title,
                description,
                points: points ? Number(points) : 100,
                expectedFlag,
                zipPath: req.file.path.replace(/\\/g, '/'),
                authorId: req.user.id,
                competitionId: competition ? competition.id : null,
            });

            return res.status(201).json({
                id: challenge.id,
                title: challenge.title,
                description: challenge.description,
                points: challenge.points,
                zipPath: challenge.zipPath,
                competitionId: challenge.competitionId,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
);

// List challenges (optionally by competition)
router.get('/', authRequired, async (req, res) => {
    try {
        const { competitionId } = req.query;

        const where = {};
        if (competitionId) {
            where.competitionId = competitionId;
        }

        const challenges = await CTFChallenge.findAll({
            where,
            attributes: ['id', 'title', 'description', 'points', 'zipPath', 'authorId', 'competitionId'],
        });

        // Filter out challenges authored by the current user
        const filtered = challenges.filter((c) => c.authorId !== req.user.id);

        return res.json(filtered);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
