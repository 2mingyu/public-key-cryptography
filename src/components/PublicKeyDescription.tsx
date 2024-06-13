import styled from 'styled-components';
import githubLogo from '../assets/images/github-logo.svg';

const handleGitHubClick = () => {
  window.open('https://github.com/2mingyu/public-key-cryptography', '_blank', 'noopener,noreferrer');
};

export default function PublicKeyDescription() {
  return (
    <>
      <Title>
        <h1>Public Key Cryptography</h1>
        <GitHubLink onClick={handleGitHubClick}>
          <GitHubLogo src={githubLogo} alt="GitHub Logo" />
          GitHub
        </GitHubLink>
      </Title>
      <p>
        This is a React application that demonstrates public key cryptography using RSA encryption. Users can generate RSA key pairs, send encrypted or signed messages, and decrypt or verify messages.
      </p>
      <p>
        이 애플리케이션은 RSA 암호화를 사용하여 공개 키 암호화를 시연하는 React 애플리케이션입니다. 사용자는 RSA 키 쌍을 생성하고, 암호화된 또는 서명된 메시지를 보내며, 메시지를 해독하거나 검증할 수 있습니다.
      </p>
      <h3>Features</h3>
      <Features>
        <FeatureList>
          <span>Generate RSA key pairs for users</span>
          <span>Send encrypted messages using recipient's public key</span>
          <span>Send signed messages using sender's private key</span>
          <span>Decrypt encrypted messages using recipient's private key</span>
          <span>Verify signed messages using sender's public key</span>
        </FeatureList>
        <FeatureList>
          <span>사용자용 RSA 키 쌍 생성</span>
          <span>수신자의 공개 키를 사용하여 암호화된 메시지 전송</span>
          <span>발신자의 개인 키를 사용하여 서명된 메시지 전송</span>
          <span>수신자의 개인 키를 사용하여 암호화된 메시지 해독</span>
          <span>발신자의 공개 키를 사용하여 서명된 메시지 검증</span>
        </FeatureList>
      </Features>
    </>
  );
}

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 4px solid gray;
`;

const GitHubLink = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border: 2px solid black;
  border-radius: 8px;
`;

const GitHubLogo = styled.img`
  width: 24px;
  margin-right: 8px;
`;

const Features = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;

  @media (max-width: 832px) {
    flex-direction: column;
    gap: 8px;
  }
  
  padding-bottom: 8px;
  border-bottom: 4px solid gray;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  
  span {
    margin-bottom: 4px;
  }
`;
