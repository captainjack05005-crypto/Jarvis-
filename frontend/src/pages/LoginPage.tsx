import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { GlassButton, GlassInput } from '@/components/HUD';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setToken, token } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      navigate('/chat');
    }
  }, [token, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });

      setToken(response.data.access_token);
      
      // Fetch user info
      const userResponse = await api.get('/auth/me');
      setUser(userResponse.data);

      toast.success('Logged in successfully!');
      navigate('/chat');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="hud-panel p-8 space-y-6">
          {/* Logo */}
          <div className="text-center">
            <h1 className="text-4xl font-bold gradient-text glow-text mb-2">
              JARVIS
            </h1>
            <p className="text-gray-400">AI Assistant</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <GlassInput
                type="text"
                placeholder="your_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <GlassInput
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <GlassButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </GlassButton>
          </form>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={handleRegister}
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
