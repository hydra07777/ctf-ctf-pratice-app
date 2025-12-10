module.exports = (sequelize, DataTypes) => {
    const Competition = sequelize.define('Competition', {
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
            allowNull: true,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('PLANNED', 'RUNNING', 'FINISHED'),
            allowNull: false,
            defaultValue: 'PLANNED',
        },
    }, {
        tableName: 'competitions',
        timestamps: true,
    });

    return Competition;
};
