'use strict';

const mysql = require('mysql');
let auth;
let dbCon;

if(process.env && process.env.PW){
  auth = {
    password: process.env.PW
  };
} else {
  auth = require('./pw.js');
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
    console.error(err);
    throw new Error('Connection to NList database failed');
  }
  console.log('Connected to NList database BIG Things are COMING');
});

module.exports = dbCon;
