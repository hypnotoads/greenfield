const multer = require('multer');

module.exports = {};

const storage = multer.diskStorage({
        destination: (request, file, callback)=> callback(null, './client/uploads/'),
        filename: (request, file, callback)=> callback(null, file.originalname)
    });

const upload = multer({
                storage: storage
            }).single('file');


module.exports.uploader =  (request, response)=> {
    upload(request,response, err =>{
        if(err){
             response.json({error_code:1, err_desc:err});
             return;
        }
         response.json({error_code:0, err_desc:null});
    });
};
