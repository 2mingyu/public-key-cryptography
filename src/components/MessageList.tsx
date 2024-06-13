import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import MessageComponent from './Message';

export default function MessageList() {
  const { messages, users } = useAppContext();

  return (
    <>
      <h2>Messages</h2>
      <MessageListContainer>
        {messages.slice().reverse().map((msg) => (
          <MessageComponent key={msg.timestamp} message={msg} users={users} />
        ))}
      </MessageListContainer>
    </>
  );
}

const MessageListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media (min-width: 1664px) { /* 832px * 2 */
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
  }
`;