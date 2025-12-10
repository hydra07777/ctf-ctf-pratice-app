module.exports = (sequelize, DataTypes) => {
    const CTFChallenge = sequelize.define('CTFChallenge', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        points: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 100,
        },
        expectedFlag: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        zipPath: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        authorId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        competitionId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
    }, {
        tableName: 'ctf_challenges',
        timestamps: true,
    });

    return CTFChallenge;
};
