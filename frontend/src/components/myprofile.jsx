import { useRef, useState, useContext } from 'react';
import { FaTimes, FaCamera, FaTrash, FaEdit, FaCheck, FaUser, FaInfoCircle, FaImages } from 'react-icons/fa';
import DeleteAccountModal from '../utils/notification';
import axios from 'axios';
import { UserContext } from '../contextapi/contextapi';
import { useNavigate } from 'react-router-dom';
import Userpic from '../images/user.jpg';
import { backendbaseurl } from '../baseurl/baseurl';

const MyProfile = ({ setMyprofile, socket }) => {
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
      const result = await axios.delete(
        `${backendbaseurl}/api/users/deleteuser/${data._id}`,
        { withCredentials: true }
      );

      socket.emit('removeaccount', { userid: result?.data });
      if (result) {
        navigate('/login');
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
        await axios.post(`${backendbaseurl}/api/users/profilepic`, formData, {
          withCredentials: true,
        });
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
      await axios.put(
        `${backendbaseurl}/api/users/updatename`,
        { userid: data._id, name },
        { withCredentials: true }
      );
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
      await axios.put(
        `${backendbaseurl}/api/users/updateabout`,
        { userid: data._id, about },
        { withCredentials: true }
      );
      setEditAbout(false);
    } catch (error) {
      console.log('Error updating about:', error);
    }
  };

  return (
    <div className="custom-scrollbar w-full h-screen overflow-y-auto overflow-x-hidden bg-slate-950 text-slate-100 font-sans border-l border-slate-800/80 flex flex-col">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80">
        <h3 className="font-semibold text-sm text-slate-200">Contact Info</h3>
        <button
          onClick={() => setMyprofile(true)}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all duration-200"
          title="Close Profile"
        >
          <FaTimes className="text-base" />
        </button>
      </div>

      <div className="p-4 space-y-6 flex-1">
        
        {/* Profile Picture Upload Section */}
        <div className="flex flex-col items-center justify-center pt-2">
          <div className="relative group cursor-pointer" onClick={handleProfilepicClick}>
            <img
              className="w-44 h-44 rounded-full object-cover border-4 border-slate-800 shadow-xl transition-all duration-300 group-hover:opacity-80"
              src={
                data.profilepicture
                  ? `${data.profilepicture}`
                  : Userpic
              }
              alt="Profile"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <FaCamera className="text-2xl text-white drop-shadow-md" />
            </div>
            <div className="absolute bottom-1 right-2 p-2.5 rounded-full bg-indigo-600 border-2 border-slate-900 text-white shadow-lg">
              <FaCamera className="text-xs" />
            </div>
          </div>
          <input
            ref={profilepic}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Name Section */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <div className="flex items-center space-x-2">
              <FaUser className="text-indigo-400" />
              <span>Your Name</span>
            </div>
            {!editName && (
              <button
                onClick={() => setEditName(true)}
                className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800/80 rounded-lg transition-colors"
                title="Edit Name"
              >
                <FaEdit className="text-xs" />
              </button>
            )}
          </div>

          {!editName ? (
            <p className="text-sm font-semibold text-slate-100 break-words pt-1">
              {name || 'No name set'}
            </p>
          ) : (
            <form onSubmit={updateUsername} className="flex items-center space-x-2 pt-1">
              <input
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                value={name}
                onChange={(e) => setName(e.target.value)}
                name="name"
                type="text"
                autoFocus
              />
              <button
                type="submit"
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors"
                title="Save"
              >
                <FaCheck className="text-xs" />
              </button>
              <button
                type="button"
                onClick={() => setEditName(false)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors"
                title="Cancel"
              >
                <FaTimes className="text-xs" />
              </button>
            </form>
          )}
        </div>

        {/* About Section */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <div className="flex items-center space-x-2">
              <FaInfoCircle className="text-emerald-400" />
              <span>About</span>
            </div>
            {!editAbout && (
              <button
                onClick={() => setEditAbout(true)}
                className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 rounded-lg transition-colors"
                title="Edit About"
              >
                <FaEdit className="text-xs" />
              </button>
            )}
          </div>

          {!editAbout ? (
            <p className="text-xs leading-relaxed text-slate-300 break-words pt-1">
              {about || 'Hey there! I am using Saif Chat.'}
            </p>
          ) : (
            <form onSubmit={updateAbout} className="flex items-center space-x-2 pt-1">
              <input
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                type="text"
                autoFocus
              />
              <button
                type="submit"
                className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors"
                title="Save"
              >
                <FaCheck className="text-xs" />
              </button>
              <button
                type="button"
                onClick={() => setEditAbout(false)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors"
                title="Cancel"
              >
                <FaTimes className="text-xs" />
              </button>
            </form>
          )}
        </div>

        {/* Media Section */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-400">
            <FaImages className="text-amber-400" />
            <span>Media, Links and Docs</span>
          </div>
          <p className="text-xs text-slate-500 italic pt-1">No shared media available</p>
        </div>

        {/* Remove Account Section */}
        <div
          onClick={handleDeleteClick}
          className="group flex items-center space-x-3 p-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/30 cursor-pointer transition-all duration-200"
        >
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
            <FaTrash className="text-xs" />
          </div>
          <span className="text-xs font-semibold text-rose-400 group-hover:text-rose-300">
            Remove Account
          </span>
        </div>

      </div>

      {/* Delete Account Modal Component */}
      <DeleteAccountModal
        show={showModal}
        onClose={closeModal}
        onConfirm={confirmDelete}
      />

    </div>
  );
};

export default MyProfile;