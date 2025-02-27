import React, { useState, useCallback } from "react";
import "./MessageInput.css"
const MessageInput = ({ onSendMessage }) => {
  const [input, setInput] = useState("");

  const handleChange = (e) => setInput(e.target.value);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!input.trim()) return;
      onSendMessage(input.trim());
      setInput(""); // Clear input after sending
    },
    [input, onSendMessage]
  );

  return (
    <form onSubmit={handleSubmit} className="message-input">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Ask a question..."
        className="input-field"
        aria-label="Type your message"
      />
      <button
        type="submit"
        className="send-button"
        disabled={!input.trim()} // Disable button if input is empty
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
