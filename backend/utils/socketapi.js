const User = require('../models/users')
const Notification= require('../models/notifications')


const userStatusonline = async (userId, sessionId) => {
  try {
    const userStatus = await User.findByIdAndUpdate(
      userId,
      {
        $set: { status: 1 },  
        $addToSet: { sessionid: sessionId }  
      },
      {
        new: true,
        select: { password: 0, retypepassword: 0 } // Exclude fields
      }
    );

    return userStatus;  
  } catch (error) {
    console.log(error);
  }




};

  


const userStatusoffline = async(userId,sessionId)=>{

    try{


        const userstatus = await User.findByIdAndUpdate(
          userId,
          {$pull: { sessionid: sessionId } },
          { new: true }  // Return the updated document
        );    

        return userstatus

    }catch(error){

        console.log(error)
    }

}

module.exports = {userStatusoffline,userStatusonline}