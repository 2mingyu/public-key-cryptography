import React, { useState } from 'react';
import styled from 'styled-components';
import forge from 'node-forge';

interface KeyGenerationProps {
  onGenerateKeys: (keys: { publicKey: string; privateKey: string }[]) => void;
}

const KeyGenerationContainer = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  &:disabled {
    background-color: #ccc;
  }
`;

async function generateKeyPair() {
  return new Promise<{ publicKey: string; privateKey: string }>((resolve) => {
    forge.pki.rsa.generateKeyPair({ bits: 2048, workers: -1 }, (err, keypair) => {
      if (err) throw err;
      resolve({
        publicKey: forge.pki.publicKeyToPem(keypair.publicKey),
        privateKey: forge.pki.privateKeyToPem(keypair.privateKey),
      });
    });
  });
}

function KeyGeneration({ onGenerateKeys }: KeyGenerationProps) {
  const [loading, setLoading] = useState(false);

  const handleGenerateKeys = async () => {
    setLoading(true);
    const keys = await Promise.all(
      Array(4).fill(null).map(() => generateKeyPair())
    );
    onGenerateKeys(keys);
    setLoading(false);
  };

  return (
    <KeyGenerationContainer>
      <Button onClick={handleGenerateKeys} disabled={loading}>
        {loading ? 'Generating keys...' : 'Generate Keys for All Users'}
      </Button>
    </KeyGenerationContainer>
  );
}

export default KeyGeneration;
