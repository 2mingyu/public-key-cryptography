declare global {
  interface User {
    name: string;
    keys: {
      publicKey: string;
      privateKey: string;
    } | null;
  }

  interface Message {
    sender: string;
    recipient: string;
    type: 'encrypted' | 'signed';
    content: string;
    originalMessage: string;
    timestamp: string;
  }
}

export {};
