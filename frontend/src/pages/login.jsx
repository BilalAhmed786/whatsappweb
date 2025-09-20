import React, { useContext, useState } from 'react';
import axios from 'axios'
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { backendbaseurl } from '../baseurl/baseurl';

const Login = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
    email: '',
    password: '',
  });



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e) => {
       e.preventDefault()
   
       try{

      const result = await axios.post(`${backendbaseurl}/api/auth/login`,{formData},{withCredentials:true})

          

            if(result.data === 'login successfully'){

             
                 window.location.href="http://localhost:5173/chat"
             
           
               
                }


    }catch(error){
      
      toast.error(error.response.data)
    
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="font-roboto text-2xl font-medium text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
              
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
          
            />
          </div>

          <button className="font-robot w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors">
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account? <a href="/" className="text-indigo-600 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
