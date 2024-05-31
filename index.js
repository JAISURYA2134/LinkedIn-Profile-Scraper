const { Sequelize } = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

// Import the Profile model
const Profile = require('./profile')(sequelize, Sequelize.DataTypes);

// Sync all models
sequelize.sync();

module.exports = {
  sequelize,
  Profile
};
