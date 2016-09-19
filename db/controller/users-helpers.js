'use strict'

const db = require('../dbConnect/connection.js');

const Users = {

  // ****SIGN IN HELPER **** //
  signIn:  (params, callback) => {
    let data = [params.email];
    const query = 'SELECT * FROM users WHERE email=? LIMIT 1';
    db.query(query, data, (err, results) => callback(err, results) );
  },

   // ****SIGN UP HELPER **** //
  signUp:  (params, callback) => {
    let data = [params.name, params.email, params.password];
    const query = "INSERT INTO users (name,email,password) VALUES (?,?,?)";
    db.query(query, data, (err, results) => callback(err, results) );
  },

  // ****CHECK USER HELPER **** //
  checkUser:  (params, callback) => {
    let data = [params.email];
    const query = "SELECT * FROM users WHERE email=? LIMIT 1";
    db.query(query, data, (err, results) => callback(err, results) );
  },

   // ****GET USER INFO FOR UPDATE PAGE **** //
  getOne:  (params, callback)=> {
    const query = 'SELECT * FROM users WHERE id=? LIMIT 1';
    db.query(query, [params], (err, results)=> callback(err, results) );
  },

  getAll: (callback)=>{
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => callback(err, results) );
  },

   // ****UPDATE USER INFO**** //
  updateOne:  (params, callback) => {
    let data = [params.name, params.photoPath, (params.languages || null), params.email, params.password];
    const query = 'UPDATE users SET name=?, photo_path=?, languages=?, email=?, password=? WHERE id ="'+params.id+'" LIMIT 1';
    db.query(query, data, (err, results) => callback(err, results) );
  },

  // ****DELETE USER [DESTROY ACCOUNT]**** //
  deleteOne:  (params, callback) => {
    let data = [params.email, params.password];
    const query = 'DELETE FROM users WHERE email=? AND password=? LIMIT 1';
    db.query(query, data, (err, results) => callback(err, results) );
  }
};

module.exports = Users;
