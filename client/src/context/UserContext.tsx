import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface UserContextType {
  users: User[];
  activeUser: User | null;
  setActiveUser: (user: User) => void;
  loading: boolean;
  refreshUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
      if (data.length > 0) {
        // Default to admin or first user if activeUser is not yet selected or missing
        setActiveUser((prev) => {
          if (!prev) return data.find((u) => u.role === 'ADMIN') || data[0];
          const match = data.find((u) => u.id === prev.id);
          return match || prev;
        });
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  return (
    <UserContext.Provider value={{ users, activeUser, setActiveUser, loading, refreshUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
