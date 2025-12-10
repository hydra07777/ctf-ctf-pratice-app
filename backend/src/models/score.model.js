module.exports = (sequelize, DataTypes) => {
    const Score = sequelize.define('Score', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        competitionId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        totalPoints: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
    }, {
        tableName: 'scores',
        timestamps: true,
    });

    return Score;
};
