import styled from 'styled-components';
import UserComponent from './User';
import KeyGeneration from './KeyGeneration';
import { useAppContext } from '../context/AppContext';

export default function UserList() {
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
    <>
      <Title>
        <h2>Users</h2>
        <KeyGeneration onGenerateKeys={handleGenerateKeys} />
      </Title>
      <UsersContainer>
        {users.map(user => (
          <UserComponent key={user.name} user={user} users={users} sendMessage={handleSendMessage} />
        ))}
      </UsersContainer>
    </>
  );
}

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const UsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media (min-width: 1664px) { /* 832px * 2 */
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
  }
`;
