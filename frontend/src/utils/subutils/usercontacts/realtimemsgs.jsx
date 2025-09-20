import { useEffect } from "react";

const realtimemsgs = (socket,data,setlastMessage,setChatusers) => {


 useEffect(() => {

    if (!socket) return;


    const handlelatestmsg = (data) => {

      setlastMessage((prev) => {
        // Check if the chat with the specified `data.chatId` exists
        const chatExists = prev.some((chat) => chat._id === data.lastmsg.chatId);

        if (chatExists) {
          // Update the existing chat
          return prev.map((chat) =>
            chat._id === data.lastmsg.chatId
              ? {
                ...chat,
                messages: [...chat.messages, data.lastmsg], // Ensure messages is an array
              }
              : chat
          );
        } else {
          // Add a new chat object
          return [
            ...prev,
            {
              _id: data.lastmsg.chatId,
              users: [data.lastmsg.sender, data.receiverid],
              messages: [data.lastmsg], // Initialize with the new message
            },
          ];
        }
      });
       
    };

    const handleisviewed = ((res) => {

      setlastMessage((prev) =>
        prev.map((chat) =>
          chat._id === res.chatId
            ? {
              ...chat,
              messages: chat.messages.map((msgs) =>
                res.receiver === data?._id
                  ? {
                    ...msgs,
                    isviewed: res.isviewed,
                    media: msgs.media.map((mdia) => ({
                      ...mdia,
                      reactions: mdia.reactions.map((reaction) => ({
                        ...reaction,
                        isviewed: res.isviewed,
                      })),
                    })),
                    reactions: msgs.reactions.map((reaction) => ({
                      ...reaction,
                      isviewed: res.isviewed,
                    })),
                  }
                  : msgs
              ),
            }
            : chat
        )
      );



    })



    const handleMessagereaction = (data) => {


      setlastMessage((prev) =>
        prev.map((chat) =>
          chat._id === data.msg.chatId
            ? {
              ...chat,
              messages: chat.messages.map((msg) =>
                msg._id === data.msg._id
                  ? {
                    ...msg,
                    reactions: [...data.msg.reactions], //replace the entire reaction arrays
                  }
                  : msg // Keep other messages unchanged
              ),
            }
            : chat // Keep other chats unchanged
        )
      );
    };
    const handleMediareaction = (data) => {

      setlastMessage((prev) =>
        prev.map((chat) =>
          chat._id === data.chatId
            ? {
              ...chat,
              messages: chat.messages?.map((msg) =>
                msg._id === data.msgId
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
              ),
            }
            : chat
        )
      );

    };



    const handleSinglefwdchat = (data) => {

      setlastMessage((prev) => {

        const chatExists = prev.some((chat) => chat._id === data.chatId);

        if (chatExists) {
          return prev.map((chat) =>

            chat._id === data.chatId && data.isblocked === false

              ? {
                ...chat,
                messages: [...chat.messages, data],
              }
              : chat
          );
        } else {
          // Only add a new chat if the sender matches chatuserinfo.userId
          if (data.sender.toString() === chatuserinfo.userId && data?.isblocked === false) {
            return [
              ...prev,
              {
                _id: data.chatId,
                messages: [data],
                users: [data.sender, data.receiver],
              },
            ];
          }
          // If sender does not match, just return the previous state without changes
        }
        return prev;
      });

    };

    const handleforwardmessages = (data) => {


      const chatid = data[0].chatId;
      const user1 = data[0].sender.toString();
      const user2 = data[0].receiver;

      setlastMessage((prev) => {
        // Check if the chat already exists
        const chatExist = prev.some((chat) => chat._id === chatid);

        if (chatExist) {
          // Update the existing chat by adding new messages
          return prev.map((chat) =>
            chat._id === chatid && data.some((message) => message.isblocked === false)
              ? {
                ...chat,
                messages: [...chat.messages, ...data], // Append all messages
              }
              : chat
          );
        } else {
          // If no chat exists, check if the logged-in user is part of this chat
          if (user1 === chatuserinfo.userId && data.some((message) => message.isblocked === false)) {
            return [
              {
                _id: chatid,
                messages: [...data], // Add all messages at once
                users: [user1, user2],
              },
            ];
          }
        }

        return prev; // Return previous state if no condition matched
      });


    };


      //remove user from list 
    const handleRemoveaccount = (data)=>{

      console.log(data)
      setChatusers((prev)=>{

       return  prev.filter((user)=>user._id !== data.userid )

        
      })
    }




    socket?.on('latestmsg', handlelatestmsg);
    socket?.on('isviewed', handleisviewed);
    socket?.on('messagereaction', handleMessagereaction)
    socket?.on('mediareaction', handleMediareaction)
    socket?.on('singlefwdchat', handleSinglefwdchat)
    socket?.on('forwardmessages', handleforwardmessages)
    socket?.on('removeaccount',handleRemoveaccount)




    return () => {
      socket?.off('latestmsg', handlelatestmsg);
      socket?.off('isviewed', handleisviewed);
      socket?.off('messagereaction', handleMessagereaction)
      socket?.off('mediareaction', handleMediareaction)
      socket?.off('singlefwdchat', handleSinglefwdchat)
      socket?.off('forwardmessages', handleforwardmessages)
      socket?.off('removeaccount',handleRemoveaccount)


    };
  }, [socket]);



}

export default realtimemsgs