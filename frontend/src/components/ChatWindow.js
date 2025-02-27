import React, { useState, useEffect } from "react";
import MessageInput from "./MessageInput";
import axios from "axios";
import "./ChatWindow.css";

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { text: "👋 Hey! How can I assist you with CDPs today?", sender: "bot" },
  ]);
  const [backendStatus, setBackendStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await axios.get("https://intelligent-cdp-chatbot.onrender.com/status");
        setBackendStatus(response.data.status === "ready");
      } catch {
        setBackendStatus(false);
      }
    };

    const interval = setInterval(checkBackendStatus, 2500);
    checkBackendStatus(); 
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (userMessage) => {
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setLoading(true);

    try {
      const response = await axios.post("https://intelligent-cdp-chatbot.onrender.com/ask", { question: userMessage });
      const { answer } = response.data;
      setMessages((prev) => [
        ...prev,
        { text: answer || "😕 Sorry, I couldn't retrieve an answer.", sender: "bot" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "🚨 Error! Please try again later.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-window">
      <h1>CDP Chatbot 🤖</h1>
      <div className="status-indicator">
        <div className={`status-light ${backendStatus ? "green" : "red"}`} />
        <span>
          {backendStatus
            ? "✅ Backend is online!"
            : "⏳ Waking up backend... Please wait!"}
        </span>
      </div>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {loading && (
          <div className="message bot">
            <i>Typing...</i>
          </div>
        )}
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;
