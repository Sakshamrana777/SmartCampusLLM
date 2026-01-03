import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { askAI } from "../api";
import { v4 as uuidv4 } from "uuid";

export default function ChatWidget() {
  const { auth } = useContext(AuthContext);

  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello 👋 How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sessionIdRef = useRef(uuidv4());
  const messagesEndRef = useRef(null);

  // auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userText },
      { role: "assistant", content: "⏳ Fetching response..." },
    ]);

    try {
      const res = await askAI({
        session_id: sessionIdRef.current,
        role: auth.role,
        user_id: auth.user_id,
        message: userText,
      });

      let reply = "";

      // 🔥 FORMAT SQL RESPONSES (NO JSON)
      if (res.route === "sql") {
        const rows = res.response?.data;

        if (!rows || rows.length === 0) {
          reply = "📊 I couldn't find any data for your query.";
        } else if (rows.length === 1) {
          const values = Object.values(rows[0]);
          reply = `📊 The result is ${values.join(", ")}.`;
        } else {
          reply = "📊 Here are the results:\n";
          rows.forEach((row, idx) => {
            reply += `${idx + 1}. ${Object.entries(row)
              .map(([k, v]) => `${k}: ${v}`)
              .join(", ")}\n`;
          });
        }
      } else {
        // normal chat / greeting
        reply = String(res.response);
      }

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: reply,
        };
        return updated;
      });
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "❌ Error fetching response",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* CHAT MESSAGES (SCROLLABLE) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[75%] p-3 rounded-lg text-sm ${
              m.role === "user"
                ? "ml-auto bg-indigo-600 text-white"
                : "mr-auto bg-white border"
            }`}
          >
            <pre className="whitespace-pre-wrap">{m.content}</pre>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BAR (ALWAYS VISIBLE) */}
      <div className="border-t p-3 flex gap-2 bg-white sticky bottom-0">
        <input
          className="input input-bordered w-full"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          className="btn btn-primary"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
