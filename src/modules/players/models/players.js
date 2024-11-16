const Sequelize = require('sequelize');
const sequelize = require('../../../configs/database.js');

const Players = sequelize.define('Players', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    phoneNumber: {
        type: Sequelize.STRING,
        unique: true
    },
    reference: {
        type: Sequelize.STRING,
    },
    matchCommission: {
        type: Sequelize.FLOAT,
        validate: {
            min: 0
        },
    },
    sessionCommission: {
        type: Sequelize.FLOAT,
        validate: {
            min: 0
        },
    },
    balance: {
        type: Sequelize.INTEGER,
        validate: {
            min: 1
        },
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
}, {
    timestamps: true,
    tableName: 'Players',
});

module.exports = Players;
