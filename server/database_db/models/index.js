'use strict';

const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

var sequelize = new Sequelize(
  config.database, 
  config.username, 
  config.password, 
  config
); 

db.sequelize = sequelize; 
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.teacher = require('./teacher')(sequelize, Sequelize);
db.class = require('./class')(sequelize, Sequelize);
db.problem = require('./problem')(sequelize, Sequelize);
db.commentary = require('./commentary')(sequelize, Sequelize);

module.exports = db;
