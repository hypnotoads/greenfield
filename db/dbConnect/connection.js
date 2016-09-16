const mysql = require('mysql');
let dbCon;

if(process.env && process.env.CLEARDB_DATABASE_URL){
  dbCon = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);
} else {
  dbCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'NList'
  });
}

dbCon.connect(function(err) {
  if (err) {
    console.log('error did not connect to rezzy CHECK YO self')
  }
  console.log('Connected to NList database BIG THIngs are COMING');
});

module.exports = dbCon;
