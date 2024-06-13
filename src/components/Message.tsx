import { useState } from 'react';
import styled from 'styled-components';
import forge from 'node-forge';
import { colors } from '../styles/color';

interface MessageProps {
  message: Message;
  users: User[];
}

export default function MessageComponent({ message, users }: MessageProps) {
  const [updatedMessage, setUpdatedMessage] = useState(message);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  const handleDecryptMessage = () => {
    if (updatedMessage.type === 'encrypted') {
      const recipientUser = users.find(u => u.name === updatedMessage.recipient);
      if (!recipientUser || !recipientUser.keys) return;

      try {
        const privateKey = forge.pki.privateKeyFromPem(recipientUser.keys.privateKey);
        const decryptedMessage = forge.util.decodeUtf8(privateKey.decrypt(forge.util.decode64(updatedMessage.content))); // Decode message as UTF-8 after decrypting
        setUpdatedMessage({
          ...updatedMessage,
          originalMessage: decryptedMessage
        });
      } catch (error) {
        setUpdatedMessage({
          ...updatedMessage,
          originalMessage: 'Failed to decrypt the message'
        });
      }
    } else {
      const senderUser = users.find(u => u.name === updatedMessage.sender);
      if (!senderUser || !senderUser.keys) return;

      try {
        const publicKey = forge.pki.publicKeyFromPem(senderUser.keys.publicKey);
        const md = forge.md.sha256.create();
        md.update(updatedMessage.originalMessage, 'utf8');
        const verified = publicKey.verify(md.digest().bytes(), forge.util.decode64(updatedMessage.content));
        setVerificationResult(verified ? 'Signature is valid' : 'Signature is invalid');
      } catch (error) {
        setVerificationResult('Failed to verify the signature');
      }
    }
  };

  return (
    <MessageCard>
      <Label><strong>From:</strong> {updatedMessage.sender}</Label>
      <Label><strong>To (visible to third parties):</strong> {updatedMessage.recipient}</Label>
      <Label><strong>Time:</strong> {new Date(updatedMessage.timestamp).toLocaleString()}</Label>
      <MessageContainer>
        <Label><strong>{updatedMessage.type === 'encrypted' ? 'Encrypted Message' : 'Signed Message'}:</strong></Label>
        <ScrollableTextContainer>{updatedMessage.content}</ScrollableTextContainer>
      </MessageContainer>
      <MessageContainer>
        <Label><strong>{updatedMessage.type === 'encrypted' ? 'Decrypted Message' : 'Original Message'}:</strong></Label>
        <ScrollableTextContainer>{updatedMessage.originalMessage || 'Message not yet decrypted'}</ScrollableTextContainer>
      </MessageContainer>
      {updatedMessage.type === 'signed' && (
        <Label><strong>Verification Result:</strong> {verificationResult || 'Signature not yet verified'}</Label>
      )}
      {updatedMessage.type === 'encrypted' ? (
        <ActionButtonWrapper>
          <ActionButton onClick={handleDecryptMessage}>Decrypt Message</ActionButton>
          <ButtonDescription>
            (using <KeyType color={colors.publicKey}>{updatedMessage.recipient}'s public key</KeyType>)
          </ButtonDescription>
        </ActionButtonWrapper>
      ) : (
        <ActionButtonWrapper>
          <ActionButton onClick={handleDecryptMessage}>Verify Signature</ActionButton>
          <ButtonDescription>
            (using <KeyType color={colors.privateKey}>{updatedMessage.sender}'s private key</KeyType>)
          </ButtonDescription>
        </ActionButtonWrapper>
      )}
    </MessageCard>
  );
}

const MessageCard = styled.div`
  display: flex;
  flex-direction: column;

  max-width: 832px;

  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Label = styled.div`
  margin-bottom: 8px;
  min-width: 144px;
`

const MessageContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ScrollableTextContainer = styled.div`
  max-height: 40px;
  overflow-x: auto;
  white-space: nowrap;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 4px 0 4px 0;
  padding: 4px;
`;

const ActionButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  width: 160px;
`;

const ActionButton = styled.button`
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
