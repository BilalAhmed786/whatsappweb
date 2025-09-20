import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
const frwdmsgcount = ({setForwardmsgid,forwardmsgid,setCheckbox,checkbox,setDisplayusers}) => {
    return (
        <div>

            {checkbox &&
                <div className='absolute text-white bg-gray-700 border-l-4 border-red-500 px-8 mb-5 z-50 opacity-90 -bottom-4 -left-4 w-full h-20  flex justify-start'>
                    {
                        <div className='flex items-center gap-3'>
                            <button onClick={() => {
                                setForwardmsgid('')
                                setCheckbox(false)

                            }}>x</button>
                            {`${forwardmsgid?.length} selected`}
                            {forwardmsgid.length > 0 &&
                                <FaArrowRight
                                    className='absolute font-semibold right-16 cursor-pointer -rotate-45'
                                    onClick={() => setDisplayusers(true)}
                                />
                            }
                        </div>
                    }

                </div>
            }
        </div>
    )
}

export default frwdmsgcount