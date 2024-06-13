import React, { useState } from 'react';
import styled from 'styled-components';
import forge from 'node-forge';

interface UserProps {
  user: User;
  users: User[];
  sendMessage: (message: Message) => void;
}

const UserCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  width: 90%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  background-color: #fff;
  margin-bottom: 20px;

  @media(min-width: 768px) {
    width: 250px;
  }
`;

const KeyContainer = styled.div`
  text-align: left;
  margin-top: 10px;
`;

const ScrollableKey = styled.div`
  max-height: 60px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px;
  margin-bottom: 10px;
`;

const RecipientList = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

const RecipientButton = styled.button<{ selected: boolean }>`
  margin: 4px;
  padding: 8px 12px;
  background-color: ${({ selected }) => (selected ? '#007BFF' : '#f0f0f0')};
  color: ${({ selected }) => (selected ? '#fff' : '#000')};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: ${({ selected }) => (selected ? '#0056b3' : '#e0e0e0')};
  }
`;

function UserComponent({ user, users, sendMessage }: UserProps) {
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState(users[0].name);

  const handleEncryptAndSend = () => {
    console.log('handleEncryptAndSend');
    const recipientUser = users.find(u => u.name === recipient);
    if (!recipientUser || !recipientUser.keys) return;

    const publicKey = forge.pki.publicKeyFromPem(recipientUser.keys.publicKey);
    const encryptedMessage = forge.util.encode64(publicKey.encrypt(forge.util.encodeUtf8(message))); // Encode message as UTF-8 before encrypting

    sendMessage({
      sender: user.name,
      recipient: recipient,
      type: 'encrypted',
      content: encryptedMessage,
      originalMessage: '',
      timestamp: new Date().toISOString(),
    });
  };

  const handleSignAndSend = () => {
    console.log('handleSignAndSend');
    if (!user.keys) return;

    const privateKey = forge.pki.privateKeyFromPem(user.keys.privateKey);
    const md = forge.md.sha256.create();
    md.update(message, 'utf8');
    const signature = forge.util.encode64(privateKey.sign(md));

    sendMessage({
      sender: user.name,
      recipient: recipient,
      type: 'signed',
      content: signature,
      originalMessage: message,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <UserCard>
      <h3>{user.name}</h3>
      {user.keys ? (
        <KeyContainer>
          <p>Public Key:</p>
          <ScrollableKey>{user.keys.publicKey}</ScrollableKey>
          <p>Private Key:</p>
          <ScrollableKey>{user.keys.privateKey}</ScrollableKey>
        </KeyContainer>
      ) : (
        <p>Keys have not been generated yet.</p>
      )}
      <input 
        type="text" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="Type a message" 
        style={{ width: '100%', marginBottom: '8px' }}
      />
      <RecipientList>
        {users.map(u => (
          <RecipientButton
            key={u.name}
            selected={u.name === recipient}
            onClick={() => setRecipient(u.name)}
          >
            {u.name}
          </RecipientButton>
        ))}
      </RecipientList>
      <button onClick={handleEncryptAndSend} style={{ width: '48%', marginRight: '4%' }}>
        Encrypt & Send
      </button>
      <span> (using {recipient}'s public key)</span>
      <button onClick={handleSignAndSend} style={{ width: '48%', marginRight: '4%' }}>
        Sign & Send
      </button>
      <span> (using {user.name}'s private key)</span>
    </UserCard>
  );
}

export default UserComponent;
