const crypto = require('crypto');
const { Server } = require('socket.io');
const { userStatusoffline, userStatusonline } = require('../utils/socketapi');

const socketfun = (server) => {

  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['POST', 'GET', 'DELETE', 'PUT'],
      credentials: true
    },
    maxHttpBufferSize: 1e8,
  });

  io.on('connection', (socket) => {
    
     socket.on('userId', async (userid) => {

    
                socket.userId = userid;     
         
         
            socket.join(userid);        
           
            io.emit('chatuser', {chatuser:123569,loginuser:userid})
      
      const user = await userStatusonline(userid, socket.id);
      
     
      
      if (user?.sessionid?.length === 1) {

        socket.broadcast.emit('user', user);  //register user broadcost to every login user
        
      }
    });


    // broadcost chatuser id



    socket.on('chatuser',(data)=>{
      
      io.emit('chatuser',data)

    })
    
//lastmessage send to chatuser

    socket.on('latestmsg',(data)=>{
   
      

          io.to(data.receiverid).emit('latestmsg',{lastmsg:data.lastmsg,receiverid:data.receiverid})
          io.to(data.lastmsg.sender).emit('latestmsg',{lastmsg:data.lastmsg,receiverid:data.receiverid})

    })

    socket.on('isviewed',(data)=>{

      
      io.to(data.sender).emit('isviewed',data)
      
      io.to(data.receiver).emit('isviewed',data)


    })
    
//reaction send to chatuser


socket.on('messagereaction', (data) => {
 
  io.to(data.receiverid).emit('messagereaction', data);
  io.to(data.loginuserid).emit('messagereaction', data);
});

socket.on('mediareaction',(data)=>{ //media reaction and undo media reaction


  io.to(data.receiverid).emit('mediareaction',data.msg)
  io.to(data.senderid).emit('mediareaction',data.msg)

})


socket.on("singlefwdchat", (data) => {

  // Loop through each message and send it to its receiver
  data.forEach((message) => {
      const receiverId = message.receiver; // Extract receiver ID
      const senderId = message.sender; // Extract sender ID
      
      // Emit the message to the receiver
      io.to(receiverId).emit("singlefwdchat", message);
      
      // Emit the message to the sender as well
      io.to(senderId).emit("singlefwdchat", message);
  });
});

socket.on("forwardmessages", (data) => {


  const receiverMessages = {}; // Object to store messages for each receiver

  // Group messages by receiver ID
  data.forEach((message) => {
      const receiverId = message.receiver;

      if (!receiverMessages[receiverId]) {
         
        receiverMessages[receiverId] = []; // Initialize array if not exists
      }
      receiverMessages[receiverId].push(message); // Add message to receiver's list
  });

  // Emit messages grouped by receiver
  Object.entries(receiverMessages).forEach(([receiverId, messages]) => {
    
    io.to(receiverId).emit("forwardmessages", messages);
    
    io.to(data[0].sender).emit("forwardmessages", messages)
  });

});


  //blockuser data emit to blockeduser
 
  socket.on('blockuser',(data)=>{

 
     io.to(data.user.loginuser._id).emit('blockuser',data.user.loginuser)
     io.to(data.user.blockuser._id).emit('blockuser',data.user.blockuser)


})

//remove account 

socket.on('removeaccount',(data)=>{

  socket.broadcast.emit('removeaccount',data)
})



   
  // Handle user disconnection
    socket.on('disconnect', async () => {

      
      const userId = socket.userId;
      
      const user = await userStatusoffline(userId, socket.id);

      if (user?.sessionid?.length === 0) {
        
                user.status = 0;     
        
         const saveuser = await user.save();   

         if(saveuser){


           socket.broadcast.emit('user', saveuser);
         
          }
        
      }
    });
  });

  return io;
};

module.exports = socketfun;
