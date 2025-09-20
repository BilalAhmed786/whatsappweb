import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
const SaifTech = ({ setShowUserList }) => {
  return (
    <>
      <button
        className='absolute inline-block lg:hidden top-5 left-3 bg-slate-600 text-white px-4 py-2 rounded-md'
        onClick={()=>setShowUserList(true)}  
      >
        User list
      </button>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-4xl font-bold text-blue-600">Welcome to SAIF TECH!</h1>
          <p className="mt-4 text-gray-700">
            We're glad to have you here. Explore our services and let us help you with your tech needs!
          </p>
        </div>
      </div>
    </>
  );
};

export default SaifTech;
