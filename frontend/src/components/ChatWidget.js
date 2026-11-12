import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios";

const GREETING = "Hi! I'm the Pressed & Co. support assistant. Ask me about pricing, services, or paste an order number to check its status.";

const ChatWidget = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]); // {role: "user" | "assistant", content: string}
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  // Don't show the customer support widget inside the admin area
  if (location.pathname.startsWith("/admin")) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/chat", { messages: nextMessages });
      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        "Sorry, I couldn't reach support right now — please try again shortly.";
      setMessages([...nextMessages, { role: "assistant", content: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <span>Support</span>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </div>

          <div className="chat-messages" ref={scrollRef}>
            <div className="chat-bubble assistant">{GREETING}</div>
            {messages.map((m, i) => (
              <div className={`chat-bubble ${m.role}`} key={i}>{m.content}</div>
            ))}
            {loading && <div className="chat-bubble assistant chat-typing">Typing…</div>}
          </div>

          <form className="chat-input-row" onSubmit={handleSend}>
            <input
              placeholder="Ask a question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>Send</button>
          </form>
        </div>
      )}

      <button className="chat-toggle" onClick={() => setOpen((v) => !v)} aria-label="Toggle support chat">
        {open ? "×" : "Chat"}
      </button>
    </div>
  );
};

export default ChatWidget;
