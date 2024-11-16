const Sequelize = require('sequelize');
const sequelize = require('../../../configs/database.js');

const Users = sequelize.define('Users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    password: {
        type: Sequelize.STRING
    },
    tokens: {
        type: Sequelize.TEXT,
        get() {
            const tokens = this.getDataValue('tokens');
            return tokens ? JSON.parse(tokens) : [];
        },
        set(value) {
            this.setDataValue('tokens', JSON.stringify(value));
        }
    },
    phoneNumber: {
        type: Sequelize.STRING,
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
    licenseExpiry: {
        type: Sequelize.DATE,
    },
    numberOfPlayers: {
        type: Sequelize.INTEGER,
    },
    numberOfConcurrentLogins: {
        type: Sequelize.INTEGER,
    },
    reference: {
        type: Sequelize.STRING,
    },
    isMaster: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    }
}, {
    timestamps: true,
    tableName: 'Users',
});

module.exports = Users;
