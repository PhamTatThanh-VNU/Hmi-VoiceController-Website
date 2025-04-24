import React, { useState, useEffect, useRef } from "react";
import { sendMessageToAI } from "../../api/genai";
import { speak, recognition, toggleRecognition } from "../../api/voiceRecognition";
import "./ChatWithAI.css";

const ChatWithAI = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null); // Ref cho phần tử ở cuối danh sách tin nhắn

  useEffect(() => {
    const setupRecognition = () => {
      recognition.onresult = async (event) => {
        const userMessage = event.results[0][0].transcript.trim();
        console.log("User said:", userMessage);

        // Thêm tin nhắn người dùng vào cuối mảng
        setChatMessages((prev) => [...prev, { sender: "user", text: userMessage }]);

        // Dừng recognition trong khi xử lý
        toggleRecognition(false, null, null);
        setIsLoading(true);
        try {
          const aiReply = await sendMessageToAI(userMessage);

          // Thêm phản hồi AI vào cuối mảng
          setChatMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);

          // Nói phản hồi của AI
          speak(aiReply);
        } catch (error) {
          console.error(error);
          setChatMessages((prev) => [
            ...prev,
            { sender: "ai", text: "Xin lỗi, tôi không thể trả lời ngay bây giờ." },
          ]);
          speak("Xin lỗi, tôi không thể trả lời ngay bây giờ.");
        } finally {
          setIsLoading(false);
        }
      };

      recognition.onerror = (event) => {
        console.error("Recognition error:", event.error);
        toggleRecognition(false, null, null);
      };

      recognition.onend = () => {
        console.log("Recognition ended. Restarting...");
        if (!isLoading && !window.speechSynthesis.speaking) {
          recognition.start();
        }
      };
    };

    setupRecognition();

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    };
  }, [isLoading]);

  useEffect(() => {
    // Cuộn xuống dưới cùng của đoạn hội thoại khi có tin nhắn mới
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [chatMessages]);

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="chat-title">
          <div className="chat-icon">
            <span className="pulse"></span>
          </div>
          <h2>Trò chuyện với AI</h2>
        </div>
      </header>

      <div className="chat-messages-container">
        <div className="chat-messages">
          {chatMessages.length === 0 && (
            <div className="empty-chat">
              <div className="empty-chat-icon">🎙️</div>
              <p>Hãy nói điều gì đó để bắt đầu cuộc trò chuyện</p>
            </div>
          )}

          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`message-wrapper ${msg.sender === "user" ? "user-wrapper" : "ai-wrapper"}`}
            >
              <div className={`message ${msg.sender === "user" ? "user-message" : "ai-message"}`}>
                <div className="message-content">{msg.text}</div>
                <div className="message-time">
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message-wrapper ai-wrapper">
              <div className="message ai-message">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} /> {/* Phần tử rỗng để cuộn xuống dưới cùng */}
        </div>
      </div>
    </div>
  );
};

export default ChatWithAI;