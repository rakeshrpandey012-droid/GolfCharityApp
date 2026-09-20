/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
// import { getMe } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // const res = await getMe();
        // setUser(res.data.user || res.data);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const persistUser = (userData) => {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }

    localStorage.removeItem('user');
    setUser(null);
    return null;
  };

  const loginUser = (token, userData) => {
    localStorage.setItem('token', token);
    return persistUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    persistUser(null);
  };

  const refreshUser = () => {
    const token = localStorage.getItem('token');
    if (!token) return Promise.resolve();
    // return getMe()
    //   .then((res) => {
    //     const nextUser = res.data.user || res.data;
    //     persistUser(nextUser);
    //     return nextUser;
    //   })
      // .catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, logout: logoutUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

export { useAuth };
