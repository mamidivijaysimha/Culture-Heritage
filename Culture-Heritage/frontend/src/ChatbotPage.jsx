import React from 'react';

const ChatbotPage = () => {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <iframe
        src="http://localhost:8501/"  // This URL should always be live once deployed
        title="Chatbot"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />
    </div>
  );
};

export default ChatbotPage;
