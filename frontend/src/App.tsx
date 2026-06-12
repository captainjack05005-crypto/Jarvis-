import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ChatPage from '@/pages/ChatPage';
import SettingsPage from '@/pages/SettingsPage';
import '@/styles/globals.css';

function App() {
  const { setUser, token } = useAuthStore();

  // Fetch user on mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL
              ? `${import.meta.env.VITE_API_URL}/auth/me`
              : 'http://localhost:8000/api/v1/auth/me',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const user = await response.json();
            setUser(user);
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      }
    };

    fetchUser();
  }, [token, setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/chat" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
