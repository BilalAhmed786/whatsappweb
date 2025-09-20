import { useEffect } from "react";


export function userealtimemsgs({socket,setChatMessage, chatuserinfo, initialLoad}){
 
      useEffect(() => {
    
    
        if (!socket) return;
    
        const handlelatestmsg = (data) => {  //realtime message to chatuser
    
          setChatMessage((prev) => {
            const chatExists = prev.some((chat) => chat._id === data.lastmsg.chatId);
    
            if (chatExists) {
              return prev.map((chat) =>
                chat._id === data.lastmsg.chatId ?
                    [...chat,data.lastmsg]
                  : chat
              );
            } else {
              // Only add a new chat if the sender matches chatuserinfo.userId
              if (data.lastmsg?.sender === chatuserinfo?.userId) {
                return [...prev,data.lastmsg];
              }
              // If sender does not match, just return the previous state without changes
              return prev;
            }
          });
    
             initialLoad.current = true  //for scroll to bottom true
            
             
          
        };
    
    
        const handleisviewed = ((data) => {
          setChatMessage((prev) =>
              prev.map((msg) =>
    
                     msg.chatId === data.chatId  ?
                {
    
                  ...msg,
                  isviewed: data.isviewed
    
    
                } : msg
                  
              ))
    
        })
    
    
        const handleMessagereaction = (data) => {
         console.log(data)
          setChatMessage((prev) =>
            prev.map((msg) =>
              msg.chatId === data.msg.chatId && msg._id === data.msg._id
                ? {
                  ...msg,
                  reactions:[...data.msg.reactions] //replace the entire reaction arrays
                    
                }
                : msg // Keep other chats unchanged
            )
          );
          
        };
    
    
    
        const handleMediareaction = (data) => {
    console.log(data)
          setChatMessage((prev) =>
            prev.map((msg) =>
              msg.chatId === data.chatId && msg._id === data.msgId
                      ? {
                        ...msg,
                        media: msg.media.map((obj) =>
                          obj._id === data.objectId
                            ? {
                              ...obj,
                              reactions: [...data.reaction], // Merge reactions instead of replacing
                            }
                            : obj
                        ),
                      }
                      : msg
                  ));
    
        };
    
    
    
        const handleSinglefwdchat = (data) => {
    
          setChatMessage((prev) => {
    
            const chatExists = prev.some((msg) => msg._id === data.chatId);
    
            if (chatExists) {
              return prev.map((msg) =>
                  msg._id === data.chatId && data.isblocked === false
                    ? [...msg, data]
                  : msg
              );
            } else {
              // Only add a new chat if the sender matches chatuserinfo.userId
              if (data.sender === chatuserinfo.userId && data.isblocked === false) {
                  return [...prev, data];
              }
              
              return prev;
            }
          });
    
         //scroll message to bottom
           initialLoad.current =true
      };
    
    
        const handleforwardmessages = (data) => {
    
    
          const chatid = data[0].chatId;
          const user1 = data[0].sender;
         
    
          setChatMessage((prev) => {
            // Check if the chat already exists
            const chatExist = prev.some((msg) => msg._id === chatid);
    
            if (chatExist) {
              // Update the existing chat by adding new messages
              return prev.map((msg) =>
                msg._id === chatid && data.some((message) => message.isblocked === false)
                  ? [...msg,...data]
                  : msg
              );
            } else {
              // If no chat exists, check if the logged-in user is part of this chat
              if (user1 === chatuserinfo.userId && data.some((message) => message.isblocked === false)) {
                return [...data];
              }
              return prev; // Return previous state if no condition matched
            }
    
          });
    
          setTimeout(() => {
            
                initialLoad.current =true
            
          }, 1000);
        };
    
    
        socket?.on('latestmsg', handlelatestmsg)
        socket?.on('isviewed', handleisviewed);
        socket?.on('messagereaction', handleMessagereaction)
        socket?.on('mediareaction', handleMediareaction)
        socket?.on('singlefwdchat', handleSinglefwdchat)
        socket?.on('forwardmessages', handleforwardmessages)
    
        return () => {
    
          socket?.off('latestmsg', handlelatestmsg);
          socket?.off('isviewed', handleisviewed);
          socket?.off('messagereaction', handleMessagereaction);
          socket?.off('mediareaction', handleMediareaction);
          socket?.off('singlefwdchat', handleSinglefwdchat)
          socket?.off('forwardmessages', handleforwardmessages)
        }
    
    
      }, [socket,chatuserinfo])
}

