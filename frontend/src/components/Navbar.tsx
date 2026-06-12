import React from 'react';
import { MessageCircle, Settings, LogOut, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { motion } from 'framer-motion';

interface NavbarProps {
  onNewChat?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNewChat }) => {
  const { user, logout } = useAuthStore();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-cyan-500/20 bg-gradient-to-b from-slate-900 to-slate-950 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="text-2xl font-bold gradient-text glow-text">
              JARVIS
            </div>
          </Link>

          {/* Center - New Chat Button */}
          {onNewChat && (
            <button
              onClick={onNewChat}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-all"
            >
              <Plus size={18} />
              <span>New Chat</span>
            </button>
          )}

          {/* Right - User Menu */}
          <div className="flex items-center gap-4">
            <Link
              to="/settings"
              className="p-2 hover:bg-cyan-500/20 rounded-lg transition-all"
              title="Settings"
            >
              <Settings size={20} />
            </Link>
            <div className="text-sm text-gray-400">{user?.username}</div>
            <button
              onClick={logout}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-all text-red-400"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
