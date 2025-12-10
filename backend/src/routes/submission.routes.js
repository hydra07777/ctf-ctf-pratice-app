const express = require('express');
const { CTFChallenge, Competition, Submission, Score } = require('../models');
const { authRequired } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authRequired, async (req, res) => {
    try {
        const { ctfId, flag } = req.body;

        if (!ctfId || !flag) {
            return res.status(400).json({ message: 'ctfId and flag are required' });
        }

        const challenge = await CTFChallenge.findByPk(ctfId);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        if (challenge.authorId === req.user.id) {
            return res.status(403).json({ message: 'You cannot solve your own challenge' });
        }

        let competition = null;
        if (challenge.competitionId) {
            competition = await Competition.findByPk(challenge.competitionId);
        }

        if (!competition) {
            return res.status(400).json({ message: 'Challenge is not attached to a competition' });
        }

        const now = new Date();
        if (
            competition.status !== 'RUNNING' ||
            !competition.startTime ||
            !competition.endTime ||
            now < competition.startTime ||
            now > competition.endTime
        ) {
            return res.status(400).json({ message: 'Competition is not running' });
        }

        // Check if user already has a correct submission for this challenge
        const existingCorrect = await Submission.findOne({
            where: { userId: req.user.id, ctfId: challenge.id, isCorrect: true },
        });

        if (existingCorrect) {
            return res.status(400).json({ message: 'You already solved this challenge' });
        }

        const isCorrect = flag === challenge.expectedFlag;

        const submission = await Submission.create({
            userId: req.user.id,
            ctfId: challenge.id,
            submittedFlag: flag,
            isCorrect,
        });

        if (isCorrect) {
            // Update score
            const [score] = await Score.findOrCreate({
                where: {
                    userId: req.user.id,
                    competitionId: competition.id,
                },
                defaults: {
                    totalPoints: 0,
                },
            });

            score.totalPoints += challenge.points;
            await score.save();

            // Emit leaderboard update
            const io = req.app.get('io');
            const updatedScores = await Score.findAll({
                where: { competitionId: competition.id },
                include: [
                    {
                        association: 'user',
                        attributes: ['id', 'username'],
                    },
                ],
                order: [['totalPoints', 'DESC']],
            });

            const leaderboard = updatedScores.map((s) => ({
                userId: s.userId,
                username: s.user.username,
                totalPoints: s.totalPoints,
            }));

            io.to(`competition_${competition.id}`).emit('score_updated', leaderboard);
        }

        return res.json({ isCorrect });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
