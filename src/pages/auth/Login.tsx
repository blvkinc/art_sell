import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error, data } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      if (data?.user) {
        navigate('/profile');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black border border-white/10 p-8 rounded-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Sign In</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-white">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40 text-white"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="text-sm font-medium text-white">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-gray-400 hover:text-white">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40 text-white"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 bg-white text-black font-medium rounded-lg transition-opacity ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-white hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-sm text-gray-400 mb-3 text-center">Demo accounts</p>
          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={() => {
                setEmail('user@example.com');
                setPassword('password123');
              }}
              className="py-2 px-3 bg-white/5 border border-white/10 rounded text-sm text-white hover:bg-white/10 transition-colors"
            >
              Buyer: user@example.com
            </button>
            <button 
              onClick={() => {
                setEmail('artist@example.com');
                setPassword('password123');
              }}
              className="py-2 px-3 bg-white/5 border border-white/10 rounded text-sm text-white hover:bg-white/10 transition-colors"
            >
              Seller: artist@example.com
            </button>
            <button 
              onClick={() => {
                setEmail('admin@example.com');
                setPassword('password123');
              }}
              className="py-2 px-3 bg-white/5 border border-white/10 rounded text-sm text-white hover:bg-white/10 transition-colors"
            >
              Admin: admin@example.com
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            (Password for all: "password123")
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login; 