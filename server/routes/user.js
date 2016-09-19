const Users = require('../../db/controller/users-helpers.js');
const hashHelpers = require("../helpers/hashHelpers");
const Promise = require("bluebird");
const bcrypt = require("bcrypt-nodejs");

module.exports = {};

// lOGIN USERS AND REGISTER SESSION
module.exports.signIn = (req, res) => {
// redirect to signup when user does not exist
  Users.signIn(req.body, (err,data) => {
    if(data.length > 0) {
      bcrypt.compare(req.body.password, data[0].password, (err, result) =>  {
        if(result){
          req.session.email = data[0].email;
          req.session.user = data[0].id;
          res.status(202).send();
        }else{
          res.status(401).send("That email and/or password was not found");
        }
      });
    } else {
      res.status(401).send("That email and/or password was not found");
    }
  });
};


//SIGN UP USERS AND REGISTER SESSION

module.exports.signUp = (req, res)=>{

  //check if user exists already

  Users.checkUser(req.body,(err,data)=>{

    if(err) throw err;

    // If user exists send them a message and reroute them to login page
    if(data.length > 0){
      res.status(409).send("The email address you specified is already in use.");
    }else{
      hashHelpers.hashPassword(req.body.password)
      .then(hashed=>{
        req.body.password = hashed;

        Users.signUp(req.body, (err,data)=>{
          if(err) console.log(err);
          req.session.email = req.body.email;
          req.session.user = data.insertId;
          res.status(200).send();
        });
      })
      //if user doesn't exist, sign them up and reroute them to home page

    }
  });
};


module.exports.getOneUser = (req, res)=>{
  //verify user is currently signed in
  if(req.session !== undefined){
    Users.getOne(req.session.user, (err,data)=>{
      if(err) console.log(err);
      res.json(data);
    });
  } else {
    res.status(401).send("That email and/or password was not found");
  }
};

module.exports.updateOne = (req, res)=>{
  //verify user is currently signed in
  if(req.body.newPassword){
    hashHelpers.hashPassword(req.body.newPassword)
    .then(hashed=>{
      delete req.body.newPassword;
      req.body.password = hashed;
      Users.updateOne(req.body, (err,data)=>{
        if(err) console.log(err);
        res.json(data);
      });
    });
  }else{
    Users.updateOne(req.body, (err,data)=>{
      if(err) console.log(err);
      res.json(data);
    });
  }
};

module.exports.deleteOne = (req, res)=>{
  //verify user is currently signed in
  Users.deleteOne(req.body, (err,data)=>{
    if(err) console.log(err);
    //delete user session here
    res.json(data);
  });
};

//LOGOUT ROUTE
module.exports.logout = (req, res)=>{
  req.session = undefined;
  req.session.destroy();
  res.status(200).send("request processed");
  };

module.exports.getAll = (req, res)=>{
  Users.getAll((err,data)=>{
      if(err) console.log(err);
      res.json(data);
  });
};
