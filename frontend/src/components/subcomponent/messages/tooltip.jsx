import React from 'react'

const tooltip = ({msg, reaction, emojihoverid}) => {
    return (
        <div>

            {msg.text ?
                <div
                    className={`absolute z-50 -bottom-1 w-24 text-center bg-slate-900 border border-slate-800 text-slate-200 text-xs py-1.5 rounded-md shadow-lg pointer-events-none
                                transition-opacity ease-in duration-[700ms] 
                                ${emojihoverid === reaction._id ? "opacity-100" : "opacity-0"}`}
                >
                    <span>{reaction.user.name}</span>
                </div> :
                <div
                    className={`absolute z-50 bottom-2 w-24 text-center bg-slate-900 border border-slate-800 text-slate-200 text-xs py-1.5 rounded-md shadow-lg pointer-events-none
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