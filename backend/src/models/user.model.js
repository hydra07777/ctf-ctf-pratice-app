const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('ADMIN_GENERAL', 'PARTICIPANT'),
            allowNull: false,
            defaultValue: 'PARTICIPANT',
        },
    }, {
        tableName: 'users',
        timestamps: true,
    });

    User.prototype.checkPassword = function (password) {
        return bcrypt.compare(password, this.passwordHash);
    };

    return User;
};
