import React from 'react';
import styled from 'styled-components';
import UserComponent from './User';
import KeyGeneration from './KeyGeneration';
import { useAppContext } from '../context/AppContext';

const UserListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const UsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
  width: 100%;

  @media(min-width: 768px) {
    flex-direction: row;
  }
`;

function UserList() {
  const { users, setUsers, setMessages } = useAppContext();

  const handleGenerateKeys = (keys: { publicKey: string; privateKey: string }[]) => {
    const updatedUsers = users.map((user, index) => ({
      ...user,
      keys: keys[index],
    }));
    setUsers(updatedUsers);
  };

  const handleSendMessage = (message: Message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  return (
    <UserListContainer>
      <h2>Users</h2>
      <KeyGeneration onGenerateKeys={handleGenerateKeys} />
      <UsersContainer>
        {users.map(user => (
          <UserComponent key={user.name} user={user} users={users} sendMessage={handleSendMessage} />
        ))}
      </UsersContainer>
    </UserListContainer>
  );
}

export default UserList;
