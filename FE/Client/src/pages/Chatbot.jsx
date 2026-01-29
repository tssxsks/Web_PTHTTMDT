import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import * as chatbotApi from '../services/chatbotApi';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Xin chào! Tôi là chatbot của Shoe Store. Tôi có thể giúp bạn tìm kiếm sản phẩm, trả lời câu hỏi về đơn hàng hoặc thông tin khác. Có gì tôi có thể giúp bạn?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Get bot response
      const response = await chatbotApi.sendChatMessage(input);
      const botMessage = { type: 'bot', text: response.data.message || 'Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { type: 'bot', text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-96 md:h-96 lg:h-[500px]">
        {/* Header */}
        <div className="bg-primary text-white p-4">
          <h1 className="text-lg font-bold">Hỗ trợ khách hàng</h1>
          <p className="text-sm text-gray-200">Chatbot AI - Hỗ trợ 24/7</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.type === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                Đang suy nghĩ...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2 border rounded-lg outline-none focus:border-primary"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition disabled:opacity-50 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
