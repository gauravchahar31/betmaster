const Sequelize = require('sequelize');
const sequelize = require('../../../configs/database.js');

const Sessions = sequelize.define('Sessions', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    matchId: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    sessionName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    time: {
        type: Sequelize.TIME,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    isDeclared: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    result: {
        type: Sequelize.STRING
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    }
}, {
    timestamps: true,
    tableName: 'Sessions',
});

module.exports = Sessions;
