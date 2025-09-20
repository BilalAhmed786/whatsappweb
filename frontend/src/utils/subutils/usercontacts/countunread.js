export const countunreadmsgs =(messages,data,user)=>{
 

       if (!Array.isArray(messages)) return 0;
     
       return  messages.filter(
                      (message) =>
                        message.sender !== data._id && message.isviewed === false  
                    )
                    .concat(   //unread text reactions 
                       messages.filter((message) =>
                        message.reactions.some(
                          (reaction) =>
                            reaction.user._id !== data._id &&
                            reaction.isviewed === false &&
                            !reaction.blockedbyuser.includes(user._id)
                        )
                      )
                    )
                    .concat(  //unread media reactions     they all get togather
                       messages.filter((message) =>
                        message.media.some((media) =>
                          media.reactions.some(
                            (reaction) =>
                              reaction.user._id !== data._id &&
                              reaction.isviewed === false &&
                              !reaction.blockedbyuser.includes(user._id)
                          )
                        )
                      )
                    ).length;
    

}