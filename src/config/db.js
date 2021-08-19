
const app =require ('../server')
const db = require('../database/index');
app.db = db;

module.exports = app;