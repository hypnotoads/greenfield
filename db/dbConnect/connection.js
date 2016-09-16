const mysql = require('mysql');

// const dbCon = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'NList'
// });

const dbCon = mysql.createConnection(CLEARDB_DATABASE_URL);

dbCon.connect(function(err) {
  if (err) {
    console.log('error did not connect to rezzy CHECK YO self')
  }
  console.log('Connected to NList database BIG THIngs are COMING');
});

module.exports = dbCon;
