import React from 'react';

function PublicKeyDescription() {
  return (
    <div>
      <h2>Public Key Cryptography</h2>
      <p>
        Public key cryptography uses pairs of keys: public keys, which may be known to others,
        and private keys, which must be kept secret. The public key is used to encrypt messages,
        and the private key is used to decrypt them.
      </p>
      <p>
        이 애플리케이션은 RSA 암호화를 사용하여 공개 키 암호화를 시연하는 React 애플리케이션입니다.
        사용자는 RSA 키 쌍을 생성하고, 암호화된 또는 서명된 메시지를 보내며, 메시지를 해독하거나 검증할 수 있습니다.
      </p>
      <h3>Features</h3>
      <ul>
        <li>Generate RSA key pairs for users</li>
        <li>Send encrypted messages using recipient's public key</li>
        <li>Send signed messages using sender's private key</li>
        <li>Decrypt encrypted messages using recipient's private key</li>
        <li>Verify signed messages using sender's public key</li>
      </ul>
      <ul>
        <li>사용자용 RSA 키 쌍 생성</li>
        <li>수신자의 공개 키를 사용하여 암호화된 메시지 전송</li>
        <li>발신자의 개인 키를 사용하여 서명된 메시지 전송</li>
        <li>수신자의 개인 키를 사용하여 암호화된 메시지 해독</li>
        <li>발신자의 공개 키를 사용하여 서명된 메시지 검증</li>
      </ul>
    </div>
  );
}

export default PublicKeyDescription;
