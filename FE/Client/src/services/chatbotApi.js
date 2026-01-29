import api from './api';

// Gửi tin nhắn tới chatbot
export const sendChatMessage = (message) => {
  return api.post('/chatbot', { message });
};
