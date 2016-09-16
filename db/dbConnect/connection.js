const mysql = require('mysql');

// const dbCon = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'NList'
// });

const dbCon = mysql.createConnection({
  host: 'ec2-54-243-203-141.compute-1.amazonaws.com',
  user: 'potiaydibnuhwv',
  password: 'UI6U7Qub_90NMi2DlbzcEQswaP',
  database: 'd32d0l1bj1c3em',
  port: 5432
});

dbCon.connect(function(err) {
  if (err) {
    console.log('error did not connect to rezzy CHECK YO self')
  }
  console.log('Connected to NList database BIG THIngs are COMING');
});

module.exports = dbCon;
