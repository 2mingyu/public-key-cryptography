import { useState } from 'react';
import styled from 'styled-components';
import forge from 'node-forge';
import { colors } from '../styles/color';

interface UserProps {
  user: User;
  users: User[];
  sendMessage: (message: Message) => void;
}

export default function UserComponent({ user, users, sendMessage }: UserProps) {
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState(users[0].name);

  const handleEncryptAndSend = () => {
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
      <KeyContainer>
        <Label color={colors.publicKey}><strong>Public Key:</strong></Label>
        <ScrollableKey>
          {user.keys ? user.keys.publicKey : 'Keys have not been generated yet.'}
        </ScrollableKey>
      </KeyContainer>
      <KeyContainer>
        <Label color={colors.privateKey}><strong>Private Key:</strong></Label>
        <ScrollableKey>
          {user.keys ? user.keys.privateKey : 'Keys have not been generated yet.'}
        </ScrollableKey>
      </KeyContainer>
      <Input 
        type="text" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="Type a message"
      />
      <ButtonContainer>
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
        <SendButtonWrapper>
          <SendButton onClick={handleEncryptAndSend}>
            Encrypt & Send
          </SendButton>
          <ButtonDescription>
            (using <KeyType color={colors.publicKey}>{recipient}'s public key</KeyType>)
          </ButtonDescription>
        </SendButtonWrapper>
        <SendButtonWrapper>
          <SendButton onClick={handleSignAndSend}>
            Sign & Send
          </SendButton>
          <ButtonDescription>
            (using <KeyType color={colors.privateKey}>{user.name}'s private key</KeyType>)
          </ButtonDescription>
        </SendButtonWrapper>
      </ButtonContainer>
    </UserCard>
  );
}

const UserCard = styled.div`
  display: flex;
  flex-direction: column;

  max-width: 832px;

  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Label = styled.div<{ color: string }>`
  min-width: 88px;
  color: ${({ color }) => color};
`;

const KeyContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ScrollableKey = styled.div`
  max-height: 40px;
  overflow-x: auto;
  white-space: nowrap;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 4px 0 4px 0;
  padding: 4px;
`;

const Input = styled.input`
  padding: 4px;
  margin: 4px 0 4px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  gap: 16px;
  margin: 8px 0;

  @media (max-width: 832px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const RecipientList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const RecipientButton = styled.button<{ selected: boolean }>`
  height: 32px;
  padding: 8px 12px;
  background-color: ${({ selected }) => (selected ? '#007BFF' : '#f0f0f0')};
  color: ${({ selected }) => (selected ? '#fff' : '#000')};
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const SendButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  width: 160px;
`;

const SendButton = styled.button`
  width: 100%;
  padding: 8px;
  font-size: 16px;
  cursor: pointer;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
`;

const ButtonDescription = styled.span`
  font-size: 12px;
  color: ${colors.descriptionText};
`;

const KeyType = styled.span<{ color: string }>`
  color: ${({ color }) => color};
`;
