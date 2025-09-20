const jwt = require('jsonwebtoken')

const userAuthorize = async(req,res,next)=>{

    const token = req.cookies?.token;

    if(token){

             jwt.verify(token,process.env.SK,(err,data)=>{

            if(err){

                return res.status(401).json({ message: 'Unauthorized access'});
            }

            
                req.userId = data.id;

            next()
        })

    }else{

        return res.status(401).json({ message: 'Invalid user' }); 
    }



}

module.exports = userAuthorize