import { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { backendbaseurl } from '../baseurl/baseurl';
import { UserContext } from '../contextapi/contextapi';

const Login = () => {
  const navigate = useNavigate();
  const { fetchUserInfo } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await axios.post(
        `${backendbaseurl}/api/auth/login`,
        { formData },
        { withCredentials: true }
      );

      if (result.data === 'login successfully') {
        if (fetchUserInfo) {
          await fetchUserInfo();
        }
        toast.success('Welcome back!');
        navigate('/chat');
      }
    } catch (error) {
      toast.error(error.response?.data || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-950 text-slate-100 font-sans">
      
      {/* LEFT COLUMN: Visual Branding & Hero Section */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-black border-r border-slate-800">
        {/* Glow Effects */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Logo */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Saif Chat
          </span>
        </div>

        {/* Dynamic Hero Content */}
        <div className="relative z-10 max-w-lg space-y-6">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Version 2.0 Live
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
            Connect and collaborate seamlessly.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Experience next-generation messaging, real-time analytics, and secure integration built for modern teams.
          </p>

          {/* User Feedback Callout */}
          <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800 flex items-center space-x-4">
            <div className="flex -space-x-2">
              <div className="w-9 h-9 rounded-full bg-indigo-500 border-2 border-slate-900 flex items-center justify-center text-xs font-bold">JD</div>
              <div className="w-9 h-9 rounded-full bg-purple-500 border-2 border-slate-900 flex items-center justify-center text-xs font-bold">AS</div>
              <div className="w-9 h-9 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-xs font-bold">MK</div>
            </div>
            <p className="text-xs text-slate-300">
              <strong className="text-white font-semibold">10,000+ professionals</strong> rely on our workspace daily.
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} Platform Inc. All rights reserved.
        </div>
      </div>

      {/* RIGHT COLUMN: Form Container */}
      <div className="flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white">Sign In</h2>
            <p className="text-sm text-slate-400">
              Welcome back! Enter your details to access your account.
            </p>
          </div>

          {/* Separator */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-800"></div>
            <span className="absolute bg-slate-950 px-3 text-xs text-slate-500 uppercase tracking-wider">
              Or continue with
            </span>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="you@domain.com"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <a href="#forgot" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Box */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950"
              />
              <label htmlFor="remember" className="text-xs text-slate-400 select-none cursor-pointer">
                Keep me logged in for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-slate-400 pt-4">
            Don't have an account?{' '}
            <Link to="/" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Login;