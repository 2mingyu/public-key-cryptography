import { useState } from 'react';
import styled from 'styled-components';
import forge from 'node-forge';

interface KeyGenerationProps {
  onGenerateKeys: (keys: { publicKey: string; privateKey: string }[]) => void;
}

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

export default function KeyGeneration({ onGenerateKeys }: KeyGenerationProps) {
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
    <>
      <Button onClick={handleGenerateKeys} disabled={loading}>
        {loading ? 'Generating RSA keys...' : 'Generate RSA Keys for All Users'}
      </Button>
    </>
  );
}

const Button = styled.button`
  font-size: 16px;
  cursor: pointer;
  background-color: transparent;
  color: black;
  border: none;
  text-decoration: underline;

  &:disabled {
    color: gray;
    cursor: not-allowed;
    text-decoration: none;
  }
`;