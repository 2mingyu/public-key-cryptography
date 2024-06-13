import React, { createContext, useState, ReactNode } from 'react';

interface AppContextProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const initialUsers: User[] = [
  { name: 'Alice', keys: null },
  { name: 'Bob', keys: null },
  { name: 'Charlie', keys: null },
  { name: 'David', keys: null },
];

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState(initialUsers);
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <AppContext.Provider value={{ users, setUsers, messages, setMessages }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
