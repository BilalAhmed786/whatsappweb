import React from 'react'

const tooltip = ({msg,reaction,emojihoverid}) => {
    return (
        <div>

            {msg.text ?
                <div
                    className={`absolute z-50 -bottom-1 w-24 text-center bg-black text-white text-xs py-2
                                transition-opacity ease-in duration-[700ms] 
                                ${emojihoverid === reaction._id ? "opacity-100" : "opacity-0"}`}
                >
                    <span>{reaction.user.name}</span>
                </div> :
                <div
                    className={`absolute z-50 bottom-2 w-24 text-center bg-black text-white text-xs py-2
                                               transition-opacity ease-in duration-[700ms] 
                                               ${emojihoverid === reaction._id ? "opacity-100" : "opacity-0"}`}
                >
                    <span>{reaction.user.name}</span>
                </div>

            }


        </div>
    )
}

export default tooltip