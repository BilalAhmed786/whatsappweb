import React from 'react'
import { FaCheck } from 'react-icons/fa'
const msgdelivercheck = ({msg,data}) => {


    return (
        <div>
            {msg.sender._id === data._id ?

                msg.isviewed === true && msg.isblocked === false ?

                    <div className="absolute text-[9px]  text-blue-500 right-2 -bottom-3">
                        <FaCheck /><FaCheck className="-mt-1" />
                    </div>
                    : msg.isblocked === false && msg.isviewed === false ?
                        <div className="absolute text-[9px] right-2 -bottom-3 text-gray-700">
                            <FaCheck /><FaCheck className="-mt-1" />
                        </div>
                        :
                        <div className="absolute text-[9px] right-3 -bottom-4 text-gray-700">
                            <FaCheck className="-mt-1" />
                        </div>

                : ""
            }




        </div>
    )
}

export default msgdelivercheck