import React, { useState } from 'react';
import styled from 'styled-components';
import forge from 'node-forge';

interface MessageProps {
  message: Message;
  users: User[];
}

const MessageCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 10px;
  background-color: #fff;
  width: 90%;

  @media(min-width: 768px) {
    width: 80%;
  }
`;

const ScrollableTextContainer = styled.div`
  max-height: 100px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

function MessageComponent({ message, users }: MessageProps) {
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
      <p><strong>From:</strong> {updatedMessage.sender}</p>
      <p><strong>To:</strong> {updatedMessage.recipient} (visible to third parties)</p>
      <p><strong>Time:</strong> {new Date(updatedMessage.timestamp).toLocaleString()}</p>
      <p><strong>{updatedMessage.type === 'encrypted' ? 'Encrypted Message' : 'Signed Message'}:</strong></p>
      <ScrollableTextContainer>
        <pre>{updatedMessage.content}</pre>
      </ScrollableTextContainer>
      <p><strong>{updatedMessage.type === 'encrypted' ? 'Decrypted Message' : 'Original Message'}:</strong> {updatedMessage.originalMessage || 'Message not yet decrypted'}</p>
      {updatedMessage.type === 'encrypted' ? (
        <>
          <button onClick={handleDecryptMessage}>Decrypt Message</button>
          <p>Using: Private Key of {updatedMessage.recipient}</p>
        </>
      ) : (
        <>
          <button onClick={handleDecryptMessage}>Verify Signature</button>
          <p>Using: Public Key of {updatedMessage.sender}</p>
        </>
      )}
      {updatedMessage.type === 'signed' && (
        <p><strong>Verification Result:</strong> {verificationResult || 'Signature not yet verified'}</p>
      )}
    </MessageCard>
  );
}

export default MessageComponent;
