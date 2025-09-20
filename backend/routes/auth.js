const express = require('express')
const User = require('../models/users')
const jwt = require('jsonwebtoken')
const bcrypt =require('bcryptjs')
const userAuthorize = require('../middleware/middleware')

const router = express.Router()

router.post('/register',async(req,res)=>{

    const {formData:{name,email,password,retypepassword}} = req.body

    const validation =[]

    if(!name || !email || !password || !retypepassword)


        validation.push('All fields required')

        if(password !== retypepassword){

        
        validation.push('passwords are Mismatch')

        }
try{

    
    const user = await User.findOne({email:email})


    if(user){

        validation.push('Already register with this email')
    }

    if(validation.length > 0){


        return res.status(400).json(validation)

    }

         const createuser  =  new User({name,email,password,retypepassword})

         const usersave = await createuser.save() 


         const userdet = await User.findOne({_id:usersave._id},{password:0,retypepassword:0})

        const token = jwt.sign({ id: usersave._id },process.env.SK, { expiresIn: '1h' });

        // Store the token in an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,  // Prevents access to the cookie from JavaScript in the browser
            secure: process.env.NODE_ENV === 'production',  // Use HTTPS in production
            sameSite: 'strict',  // Prevent CSRF
            maxAge: 3600000,  // Cookie expiration time (1 hour)
        });

        return res.json({msg:"user registerd succesfully",user:userdet})

}catch(error){
    
   if (err.code === 11000) { 
    return res.status(400).json(["Email already registered"]);
  }
}


})


router.post('/login',async(req,res)=>{

    const {formData:{email,password}} = req.body

if(!email || !password){

    return res.status(401).json('All field required')
}

try{

    const user = await User.findOne({email:email})

    if(!user){

        return res.status(401).json('Invalid email or password')
    }

        const compare = await bcrypt.compare(password,user.password)

        if(!compare){

            return res.status(401).json('invalid email or password')
        }

            
               const token = jwt.sign({ id: user._id },process.env.SK, { expiresIn: '1h' });

        
             res.cookie('token', token, {
              httpOnly: true,  
              secure: process.env.NODE_ENV === 'production',  
              sameSite: 'strict',
              maxAge: 3600000,  
          });

            return res.json('login successfully')

}catch(error){

    console.log(error)
}

})

router.post('/logout', (req, res) => {
   
    res.clearCookie('token', {
        httpOnly: true,
        secure: true, // Use this in production
        sameSite: 'strict'
    });
    res.status(200).json('Logged out successfully');
});


router.get('/userinfo',userAuthorize,async(req,res)=>{

    try{

            const userinfo = await User.findOne({_id:req.userId},{password:0,retypepassword:0})

            return res.json(userinfo)

    }catch(error){

        if(error){
           
            return res.status(401).json('invalid user')
        
        }
    }

})

module.exports = router