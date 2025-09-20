import React, { useRef, useState, useContext } from 'react';
import { FaTimes, FaCamera, FaTrash, FaEdit } from 'react-icons/fa';
import DeleteAccountModal from '../utils/notification'
import axios from 'axios';
import { UserContext } from '../contextapi/contextapi';
import {useNavigate} from 'react-router-dom'
import { backendbaseurl } from '../baseurl/baseurl';



const MyProfile = ({ setMyprofile,socket}) => {


  const profilepic = useRef();
  const { data, fetchUserInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [editName, setEditName] = useState(false);
  const [editAbout, setEditAbout] = useState(false);
  const [name, setName] = useState(data.name);
  const [about, setAbout] = useState(data.about);
  const [showModal, setShowModal] = useState(false);



  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {

    setShowModal(false);
  };
    // Remove account
    const confirmDelete = async () => {
      try {
       const result = await axios.delete(`${backendbaseurl}/api/users/deleteuser/${data._id}`,{withCredentials:true});

              socket.emit('removeaccount',{userid:result?.data})
              if(result){

                navigate('/login')
              }     


             } catch (error) {
        console.log('Error removing account:', error);
      }
    };

  // Handle file input click
  const handleProfilepicClick = () => {
    profilepic.current.click(); // Trigger file input click
  };

  // Handle file upload separately after selecting the file
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      // Prepare FormData with the file and userId
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('userid', data?._id);

      try {
        // Upload the file to the server
        await axios.post(`${backendbaseurl}/api/users/profilepic`, formData,{withCredentials:true});
        fetchUserInfo();
        console.log('Profile picture uploaded successfully');
      } catch (error) {
        console.log('Error uploading profile picture', error);
      }
      // Clear the input after the upload
      profilepic.current.value = ''; // Reset input value
    }
  };



  // Handle name update submission
  const updateUsername = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${backendbaseurl}/api/users/updatename`, { userid: data._id, name },{withCredentials:true});
      fetchUserInfo(); // Fetch updated user info after name change
      setEditName(false);
    } catch (error) {
      console.log('Error updating name:', error);
    }
  };

  // Handle about update submission
  const updateAbout = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${backendbaseurl}/api/users/updateabout`, { userid: data._id, about },{withCredentials:true});
       setEditAbout(false);
    
      
    
      } catch (error) {
      console.log('Error updating about:', error);
    }
  };

  return (
    <div className="custom-scrollbar w-full h-screen overflow-y-auto overflow-x-hidden">
      <span className="block m-3 cursor-pointer" onClick={() => setMyprofile(true)}>
        <FaTimes />
      </span>
      <h5 className="ml-5 mt-5">Contact info</h5>
      <div className="relative flex justify-center items-center">
        <img
          className="w-60 h-60 rounded-full"
          src={`${backendbaseurl}/images/${data.profilepicture}`}
          alt="Profile"
        />
        <span className="absolute">
          <FaCamera className="text-3xl cursor-pointer" onClick={handleProfilepicClick} />
        </span>
        <input
          ref={profilepic}
          className="hidden"
          type="file"
          accept="image/*" // Limit to image files
          onChange={handleFileChange} // Trigger file upload when a file is selected
        />
      </div>

      {/* Name Section */}
      <div className="relative flex gap-2 mt-4 items-center justify-center">
        {!editName ? (
          <>
            <h2>{name}</h2>
            <button className="text-xs mt-0.5" onClick={() => setEditName(true)}>
              <FaEdit />
            </button>
          </>
        ) : (
          <form onSubmit={updateUsername} className="flex items-center gap-2">
            <input
              className="outline-none pl-2 ml-4 border lightgray"
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="name"
              type="text"
            />
            <button
              className='font-sans underline text-sm  text-blue-500' 
              type="submit"
              >Update
            </button>
            <FaTimes className="absolute text-gray-600 text-xs cursor-pointer" 
            onClick={() => setEditName(false)} />
          </form>
        )}
      </div>

      {/* About Section */}
      <div className="border-t-8 border-b-8 via-gray p-5 mt-5">
        <div className="flex gap-2">
          <h4>About</h4>
          <button onClick={() => setEditAbout(true)}>
            <FaEdit />
          </button>
        </div>
        {!editAbout ? (
          <div className='w-96'>
            <p className="mt-4 ml-4">{about}</p>
          </div>
        ) : (
          <form onSubmit={updateAbout} 
          className="relative">
            <input
              className="outline-none border lightgray pl-2  mt-3 ml-7"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              type="text"
            />
            <button 
              className='font-sans ml-4 underline text-sm  text-blue-500' 
              type="submit">
              Update
            </button>
            <FaTimes className="absolute  text-gray-600 text-xs top-5 ml-2 cursor-pointer" onClick={() => setEditAbout(false)} />
          </form>
        )}
      </div>

      {/* Media Section */}
      <div className="border-b-8 via-gray p-5 mt-5">
        <h4>Media Link And Docs</h4>
        <div>
          <img src="" alt="" />
        </div>
      </div>

      {/* Remove Account */}
      <div
        className="border-b-8 cursor-pointer via-gray p-5 mt-5"
        onClick={handleDeleteClick}
      >
        <span className="flex gap-1 text-red-600">
          <FaTrash className="mt-1" />
          Remove Account
        </span>
       </div>
      
       <DeleteAccountModal
          show={showModal}
          onClose={closeModal}
          onConfirm={confirmDelete}
      />


    </div>
  );
};

export default MyProfile;
