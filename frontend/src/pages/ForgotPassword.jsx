import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { backendbaseurl } from '../baseurl/baseurl';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await axios.post(`${backendbaseurl}/api/auth/forgotpassword`, {
        email,
      });

      toast.success(result.data?.msg || 'Reset link sent to your email!');
      setEmail('');
    } catch (error) {
      if (Array.isArray(error.response?.data)) {
        error.response.data.forEach((res) => toast.error(res));
      } else {
        toast.error(error.response?.data?.msg || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-950 text-slate-100 font-sans">
      
      {/* LEFT COLUMN: Branding & Value Proposition */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-black border-r border-slate-800">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Logo Header */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Saif Chat
          </span>
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 max-w-lg space-y-6">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Account Recovery
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
            Forgot your password? We’ve got you covered.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Enter your registered email address and we'll send you a secure link to reset your account password.
          </p>
        </div>

        {/* Footer Info */}
        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} Saif Chat Inc. All rights reserved.
        </div>
      </div>

      {/* RIGHT COLUMN: Forgot Password Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white">Reset Password</h2>
            <p className="text-sm text-slate-400">
              Enter your email to receive a password reset link.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="you@domain.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          {/* Navigation Links */}
          <p className="text-center text-sm text-slate-400 pt-2">
            Remembered your password?{' '}
            <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default ForgotPassword;