import React, { useState } from 'react';
import axios from 'axios'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { backendbaseurl, frontendbaseurl } from '../baseurl/baseurl';

const Register = () => {
  const navigate  = useNavigate()  

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    retypepassword: '',
  });

  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault()
    setLoading(true); // 🔹 disable button

    try{
      const result = await axios.post(
        `${backendbaseurl}/api/auth/register`,
        {formData},
        { withCredentials:true }
      )

      toast.success(result.data.msg)
      window.location.href=`${frontendbaseurl}/chat`

    }catch(error){
      console.log(error.response?.data)
      if (Array.isArray(error.response?.data)) {
        error.response.data.map((res)=> toast.error(res))
      } else {
        toast.error("Something went wrong")
      }
    }finally{
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="font-roboto text-2xl font-medium text-center mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-4">
            <label className="font-roboto block text-sm font-medium text-gray-700">Email</label>
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="retypepassword"
              value={formData.retypepassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Confirm your password"
            />
          </div>

          <button 
            disabled={loading} // 🔹 disable while loading
            className={`w-full py-2 px-4 rounded transition-colors ${
              loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
