import axios from 'axios';
import React from 'react'
import ReactDOM from "react-dom";
import { FaTrash } from 'react-icons/fa';
import { backendbaseurl } from '../baseurl/baseurl';


const clearchat = (

  {
    messagesIds,
    setChatclear,
    chatuser,
    loginuserid,
    setUpdatemsgs
  }

) => {


  const clearAllmsgs = async (msgids, loginuserId) => {

    try {

      const result = await axios.post(`${backendbaseurl}/api/chat/clearmsgs`, { msgids, loginuserId },{withCredentials:true})

      setUpdatemsgs(Date.now())
      setChatclear(false)

    } catch (error) {

      console.log(error)
    }

  }




  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-black text-white p-6 rounded-lg m-auto shadow-lg max-w-sm w-[90%]">
        <div className='relative'>
          <button className="absolute right-0 top-0"
        onClick={() => setChatclear(false)}
          >X
          </button>
          <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
          <p className="mb-6">Chat between you and {chatuser} will be lost</p>
          <div className="flex justify-end space-x-4">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => clearAllmsgs(messagesIds, loginuserid)}
            >

              Clear
            </button>
          </div>
        </div>
      </div>
    </div>,


    document.body
  )
}

export default clearchat