'use strict'

const db = require('../dbConnect/connection.js');

//********* LINKS HELPERS **************//

let Links = {

  // ****GET ALL RESOURCES****//

  getAll: (callback) =>{

    /* ALIAS KEY
      r : resources
      t : resource_type
      l : languages
      s : sub_topic
    */
    const query = 'SELECT r.id_users, r.title, r.id, r.id_sub_topic, \
    r.id_languages, r.id_resource_type, r.link, r.date_added, \
    r.date_updated, r.keywords, r.likes, r.dislikes,\
    t.type, l.name, l.logo, s.topic, u.name AS "username", u.reputation\
    FROM resources r \
    JOIN resource_type t ON t.id = r.id_resource_type \
    JOIN languages l ON l.id = r.id_languages \
    JOIN sub_topic s ON s.id = r.id_sub_topic \
    JOIN users u on u.id = r.id_users \
    ORDER BY date_added DESC';
    db.query(query, (err, results) => callback(err, results) );
  },

  getLanguages: (callback) =>{
    const query = 'SELECT * FROM languages';
    db.query(query, (err, results) => callback(err, results) );
  },


  getAllComments: (callback) =>{
    const query = 'SELECT c.id, c.id_resources, c.id_users, c.title, c.comment, c.likes, c.dislikes, c.date_added, c.date_updated, u.name \
    FROM comments c\
    JOIN users u ON u.id = c.id_users \
    ORDER BY date_added DESC';
    db.query(query, (err, results) => callback(err, results) );
  },

  // ****POST A RESOURCE**** //
  postOne: (params, callback) =>{

   //subtopic can be null

   let data = [params.user, params.title, params.language,(params.subTopic || null), params.type, params.link, params.keywords, params.likes, params.dislikes];

  const query = 'INSERT INTO resources(id_users, title, id_languages,\
       id_sub_topic, id_resource_type,\
       link, date_added, keywords,\
       likes, dislikes) value (?, ?,?, ?, ?, ?, NOW(), ?, ?, ?)';
    db.query(query, data, (err, results) => callback(err, results) );
  },

  // ****POST A COMMENT**** //
  postOneComment: (params, callback) =>{

  let data = [params.postid, params.userid, params.title, params.comment, params.likes, params.dislikes];

  const query = 'INSERT INTO comments(id_resources, id_users, title,\
       comment, likes, dislikes, date_added) value (?, ?, ?, ?, ?, ?, NOW())';
    db.query(query, data, (err, results) => callback(err, results) );
  },

  // ****GET A RESOURCE **** //

  getOne: (linkId, callback) =>{

    let data = [linkId];

    const query = 'SELECT r.id, l.name, t.type, r.sub_topic_id, r.link, \
    r.date_added, r.keywords, r.likes, r.dislikes \
    FROM resources r \
    LEFT OUTER JOIN resource_type t ON (r.id_resource_type = t.id) \
    LEFT OUTER JOIN languages l ON (r.id_languages = l.id) \
    WHERE r.id = ? LIMIT 1';

    db.query(query, data, (err, results) => callback(err, results) );
  },

  // ********UPDATE A VOTE******** //

  updateVote: (params, callback) =>{
    params.vote = Number(params.vote); // make sure it is being read as a number
    let voteData = [params.uid, params.id, params.vote]; //uid  = user id // id = resource id

    //Check if vote already exists
    const checkUserVote = 'SELECT * FROM user_voted WHERE id_users = '+params.uid;
    let alreadyVoted = false;
    let likes = 0; //This will store all of the current likes for this resource
    let dislikes = 0; //This will store all of the current dislikes for this resource
    let userVoteStatus = null;

    db.query(checkUserVote, (err, userVoteData) => {
      userVoteData.forEach(resources => {
        if(resources.id_resources === params.id){
          alreadyVoted = true;
          userVoteStatus = Number(resources.vote); //make sure it is read as a number
        }
      });//we don't close off the query here to force an asynchronous process (maybe convert to promises if time permits)


      //Check if vote already exists
      const checkResourceVotes = 'SELECT vote FROM user_voted WHERE id_resources = '+params.id;

      db.query(checkResourceVotes, (err, resourceVoteData) => {
        resourceVoteData.forEach(resource => {
          if(resource.vote === 1){
            likes++; //get total number of current likes based on user vote table data
          }
          if(resource.vote === 0){
            dislikes++; //get total number of current dislikes based on user vote table data
          }
        }); //we don't close off the query here to force an asynchronous process (maybe convert to promises if time permits)

        const updateResourcesTable = (finalLike, finalDislike) => { //this function is reused multiple times; abstracted to update resource table;
          const finalUpdateQuery = 'UPDATE resources r SET likes = ?, dislikes = ? WHERE r.id = '+ params.id;
          db.query(finalUpdateQuery, [finalLike, finalDislike], (finalError, finalResource)=>{ callback(finalError, finalResource)});
        };

        if(!alreadyVoted){
          const votedQuery = 'INSERT INTO user_voted(id_users,id_resources, vote) VALUE(?,?,?)';

          params.vote === 1 ? likes++ : dislikes++ ;
          db.query(votedQuery, voteData, (error, data) => {
            updateResourcesTable(likes,dislikes);
          });
        }else{
          if(params.vote === userVoteStatus){
            const deleteVote = 'DELETE FROM user_voted WHERE id_users = ? AND id_resources = ?';
            db.query(deleteVote, [params.uid, params.id], (error, data) => {
              if(err) throw err;
              if(params.vote === 0){
                dislikes--;
                updateResourcesTable(likes,dislikes);
              }
              if(params.vote === 1){
                likes--;
                updateResourcesTable(likes,dislikes);
              }
            });
          }else{
            //if votes are equivalent, delete the vote, if they are not equivalent to what is in database, switch accordingly

            const userVoteQuery = 'UPDATE user_voted u SET vote = ? WHERE u.id_resources = '+ params.id +' AND u.id_users ='+ params.uid;
            if(params.vote > userVoteStatus){
              dislikes--;
              likes++;
              db.query(userVoteQuery, [params.vote], (error, data) =>{
                updateResourcesTable(likes, dislikes);
              });
            }else if(params.vote < userVoteStatus){
              likes--;
              dislikes++;
              db.query(userVoteQuery, [params.vote], (error, data) =>{
                updateResourcesTable(likes, dislikes);
              });
            }
          }
        }
      });
    });
  },

  // ****DELETE A RESOURCE-accessed via req.params in url bar****

  deleteOne: (linkId, callback) =>{
    let data = [linkId];
    const query = 'DELETE FROM resources WHERE id=? LIMIT 1';
    db.query(query, data, (err, results) => callback(err, results) );
  }
};

module.exports = Links;
