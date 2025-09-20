import axios from 'axios';
import React from 'react'
import ReactDOM from "react-dom";
import { FaTrash } from "react-icons/fa";
import { backendbaseurl } from '../baseurl/baseurl';
const deletemsgs = (
  {
    forwardmsgids,
    setDeletemsgs,
    setdeleteCheckbox,
    setForwardmsgid,
    loginuserid,
    setUpdatemsgs
  }


) => {



  const Deletemsgs = async (msgids, loginuserId) => {

    try {

      const result = await axios.post(`${backendbaseurl}/api/chat/deletemsgs`, { msgids, loginuserId }, { withCredentials: true })

      setdeleteCheckbox(false)
      setUpdatemsgs(Date.now())

    } catch (error) {

      console.log(error)
    }

  }

  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 w-full text-white  bg-black bg-opacity-90 flex justify-between p-4 z-50">
      <div className='flex w-full justify-between gap-2'>
        <div className='flex flex-wrap justify-center'>
          <span> {forwardmsgids.length} selected </span>

        </div>
        <div>

          <p className='flex'>Are you sure to delete messages this action will be undone ?</p>
        </div>
        <div>
          <div className='flex flex-wrap gap-2 justify-center items-center'>
            <FaTrash
              className='cursor-pointer'
              onClick={() => {
                Deletemsgs(forwardmsgids, loginuserid),
                  setForwardmsgid([])

              }}

            />

            <button onClick={() => {
              setDeletemsgs(false)
              setdeleteCheckbox(false)
              setForwardmsgid([])

            }

            }> X</button>

          </div>
        </div>
      </div>
    </div>,

    document.body
  )
}

export default deletemsgs