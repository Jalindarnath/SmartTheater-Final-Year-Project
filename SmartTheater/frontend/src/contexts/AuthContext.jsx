import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const DEMO_USERS = {
  customer: {
    email: 'arjun.shah@gmail.com',
    password: 'Demo@1234',
    name: 'Arjun Shah',
    role: 'customer',
    initials: 'AS',
  },
  staff: {
    email: 'meera.nair@smarttheater.in',
    password: 'Staff@1234',
    name: 'Meera Nair',
    role: 'staff',
    title: 'Customer Experience Lead',
    initials: 'MN',
  },
  admin: {
    email: 'priya.mehta@smarttheater.in',
    password: 'Admin@1234',
    name: 'Priya Mehta',
    role: 'admin',
    title: 'Platform Administrator',
    initials: 'PM',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('smarttheater_token'));
  const [loading, setLoading] = useState(true);

  // Switch to a demo persona with auto-login
  const switchPersona = async (personaKey) => {
    const persona = DEMO_USERS[personaKey];
    if (!persona) return;
    try {
      const res = await api.login(persona.email, persona.password);
      localStorage.setItem('smarttheater_token', res.access_token);
      localStorage.setItem('smarttheater_persona', personaKey);
      setToken(res.access_token);
      setUser({
        ...res.user,
        initials: persona.initials,
        title: persona.title,
      });
    } catch (err) {
      console.error('Failed to log in as persona:', err);
      // Fallback local mock user so UI never breaks even if offline
      setUser({
        id: personaKey,
        full_name: persona.name,
        email: persona.email,
        role: persona.role,
        initials: persona.initials,
        title: persona.title,
      });
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const savedPersona = localStorage.getItem('smarttheater_persona') || 'customer';
      await switchPersona(savedPersona);
      setLoading(false);
    };
    initAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('smarttheater_token');
    localStorage.removeItem('smarttheater_persona');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, switchPersona, logout, DEMO_USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
