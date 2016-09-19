const Links =  require("../../db/controller/links-helpers.js");
const users = require("./user");
const helper = require('sendgrid').mail;
const Users = require('../../db/controller/users-helpers.js');
//each callback below is routed to helpers that preform the actual querying on the database


//API ROUTES

/* All resources below use the Links helper s
/resources
  post -> posts one resource : uses postOne helper
  get -> gets all resources : uses getAll helper
  put -> updates one resource : uses updateOne helper -- needs user id in req.body

/resources/:id
  get -> gets one resource : uses getOne helper -- needs user id in req.params
  delete -> deletes one resource : uses deleteOne helper -- needs user id in req.params

*/

module.exports= {};

module.exports.comments = {
  getAll: (req, res)=>{
    Links.getAllComments((err,data)=>{
      if(err) console.log(err);
      res.json(data);
    });
  },

  postOne: (req, res)=>{
    if(users.sess !== undefined){
      Links.postOneComment(req.body, (err,data)=>{
        if(err) console.log(err);
        res.json(data);
      });
    } else{
      res.status(403).send("Please log in");
    }
  }
};

module.exports.resourses = {
  postOne: (req, res)=>{
    if(users.sess !== undefined){
      Links.postOne(req.body, (err,data)=>{ //Post one resource into resource database
        if(err) console.log(err);
        res.json(data);
      });
    } else{
      res.status(403).send("Please log in");
    }
  },

  getAll: (req, res)=>{
    Links.getAll((err,data)=>{
      if(err) console.log(err);
      res.json(data);
    });
  },

  getLanguages: (req, res)=>{
    Links.getLanguages((err,data)=>{
      if(err) console.log(err);
      res.json(data);
    });
  },

  updateVote: (req, res)=>{
    if(users.sess.email !== undefined){
      Links.updateVote(req.body, (err,data)=>{
        if(err) console.log(err);
        res.json(data);
      });
    } else {
      res.status(403).send("Please log in");
    }
  }
};

// SINGLE RESOURCE UPDATES (GET, PUT(UPDATE), DELETE);

module.exports.resourcesID = {

  getOne: (req, res)=>{
      Links.getOne(req.params.id, (err,data)=>{
        if(err) console.log(err);
        res.json(data);
      });
    },
// login here
  deleteOne: (req, res)=>{
      if(users.sess.email !== undefined){
        Links.deleteOne(req.params.id, (err,data)=>{
          if(err) console.log(err);
          res.json(data);
        });
      } else {
        res.status(403).send("Please log in");
      }
    },

  emailOne: (req, res) => {
    // console.log(req);

    Links.getOne(req.params.id, (linkError, [linkData]) => {
      if (linkError) {
        console.error(linkError);
      }

      // console.log(data);
      // console.log('users.sess', users.sess);
      if (users.sess.user !== undefined) {
        Users.getOne(users.sess.user, (userError, [userData]) => {
          if (userError) {
            console.error(userError);
          } else {
            // console.log('linkData', linkData);
            const fromEmail = new helper.Email(userData.email);
            const fromUsername = userData.name;
            const toEmail = new helper.Email(userData.email);
            const toUsername = req.body.name;
            const subject = `${fromUsername} thought you would like this resource!`;
            const message =
              `Hello, ${toUsername},

              Here is a resource that ${fromUsername} thought you would enjoy:

              ${linkData.link}`;
            const content = new helper.Content('text/plain', message);
            const mail = new helper.Mail(fromEmail, subject, toEmail, content);
            const sg = require('sendgrid')(process.env.SENDGRID_API_KEY // Heroku
              || require('./sendgrid-key.js').SENDGRID_API_KEY); // local

            const request = sg.emptyRequest({
              method: 'POST',
              path: '/v3/mail/send',
              body: mail.toJSON(),
            });

            sg.API(request)
              .then(response => {
                // console.log(response.statusCode);
                // console.log(response.body);
                // console.log(response.headers);
                res.json(response);
              })
              .catch(error => {
                console.error(error.response.statusCode);
              });
          }
        });
      } else {
        res.status(403).send('Please log in');
      }
    });
  },
};
