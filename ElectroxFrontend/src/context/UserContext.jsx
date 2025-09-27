import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  // Function to check if user is already logged in (on app load)
  const checkAuthStatus = async () => {
    try {
      // Try to get current user from backend
      const response = await axios.get('http://localhost:8000/user/me', {
        withCredentials: true,
      });
      
      if (response.data.success) {
        // console.log("user======",response.data.data);
        
        setUser(response.data.data);
        // console.log('User restored from session:', response.data.user);
      }
    } catch (error) {
      console.log('No active session found');
      // User is not logged in, which is fine
    } finally {
      setLoading(false);
    }
  };

  // Check auth status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const logout = async () => {
    try {
      await axios.post('http://localhost:8000/user/logout', {}, {
        withCredentials: true,
      });
      setUser(null);
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user on frontend even if backend call fails
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      loading, 
      logout,
      checkAuthStatus 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;