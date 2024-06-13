import React from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import MessageComponent from './Message';

const MessageListContainer = styled.div`
  margin-top: 20px;
  width: 90%;

  @media(min-width: 768px) {
    width: 80%;
  }
`;

function MessageList() {
  const { messages, users } = useAppContext();

  return (
    <MessageListContainer>
      <h2>Messages</h2>
      {messages.slice().reverse().map((msg) => (
        <MessageComponent key={msg.timestamp} message={msg} users={users} />
      ))}
    </MessageListContainer>
  );
}

export default MessageList;
