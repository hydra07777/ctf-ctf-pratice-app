const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserModel = require('./user.model');
const CompetitionModel = require('./competition.model');
const CTFChallengeModel = require('./ctfChallenge.model');
const SubmissionModel = require('./submission.model');
const ScoreModel = require('./score.model');

const User = UserModel(sequelize, DataTypes);
const Competition = CompetitionModel(sequelize, DataTypes);
const CTFChallenge = CTFChallengeModel(sequelize, DataTypes);
const Submission = SubmissionModel(sequelize, DataTypes);
const Score = ScoreModel(sequelize, DataTypes);

// Associations
User.hasMany(CTFChallenge, { foreignKey: 'authorId', as: 'challenges' });
CTFChallenge.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Competition.hasMany(CTFChallenge, { foreignKey: 'competitionId', as: 'challenges' });
CTFChallenge.belongsTo(Competition, { foreignKey: 'competitionId', as: 'competition' });

User.hasMany(Submission, { foreignKey: 'userId', as: 'submissions' });
Submission.belongsTo(User, { foreignKey: 'userId', as: 'user' });

CTFChallenge.hasMany(Submission, { foreignKey: 'ctfId', as: 'submissions' });
Submission.belongsTo(CTFChallenge, { foreignKey: 'ctfId', as: 'ctf' });

User.hasMany(Score, { foreignKey: 'userId', as: 'scores' });
Score.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Competition.hasMany(Score, { foreignKey: 'competitionId', as: 'scores' });
Score.belongsTo(Competition, { foreignKey: 'competitionId', as: 'competition' });

module.exports = {
    sequelize,
    User,
    Competition,
    CTFChallenge,
    Submission,
    Score,
};
