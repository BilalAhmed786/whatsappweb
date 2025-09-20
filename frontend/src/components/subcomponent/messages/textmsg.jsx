import React from 'react'
import { format } from "timeago.js";
const textmsg = ({msg,data,highlightedId}) => {
    
    return (
        <div className="flex flex-col flex-wrap gap-4 justify-left m-2">
            {msg.replyTo?.messageId &&

                <span
                    className={`border-l-4 mt-3 text-justify break-all border-red-500 pl-2 opacity-60 ${msg.sender._id === data._id ? 'text-white' : 'text-black'}`}>
                    {msg.replyTo.messageId.text}
                </span>
            }
            <span className={`break-all ${highlightedId === msg._id? 'bg-red-400':''} `}>

                {msg.text}

            </span>
            {msg.text ?
                <span className="absolute right-3 bottom-1 text-[7px]">{format(msg.createdAt)}</span> : ''
            }
        </div>
    )
}

export default textmsg