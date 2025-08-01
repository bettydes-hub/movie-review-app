// src/models/role.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    // You can set a default value if you want:
    // defaultValue: 'user',
  },
}, {
  tableName: 'roles',
  timestamps: false,
});

// When deleting a role, you can reassign users to the default role 'user' in the controller logic if desired.

module.exports = Role;
