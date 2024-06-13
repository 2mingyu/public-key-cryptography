import React from 'react';
import './App.css';
import PublicKeyDescription from './components/PublicKeyDescription';
import UserList from './components/UserList';
import MessageList from './components/MessageList';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <div className="App">
        <PublicKeyDescription />
        <UserList />
        <MessageList />
      </div>
    </AppProvider>
  );
}

export default App;
