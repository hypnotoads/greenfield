'use strict';

const mysql = require('mysql');
const auth = require('./pw.js') || null;
let dbCon;

if(process.env && process.env.PW){
  auth.password = process.env.PW;
} else {
  console.error('unknown environment, no db password availble');
}

dbCon = mysql.createConnection({
  host: 'nlist.cfajvtv3d5ui.us-west-2.rds.amazonaws.com',
  user: 'root',
  password: auth.password,
  database: 'NList',
  port: 3306
});

dbCon.connect(function(err) {
  if (err) {
    console.log(err);
  }
  console.log('Connected to NList database BIG Things are COMING');
});

module.exports = dbCon;
