import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { askAI } from "../api";
import { v4 as uuidv4 } from "uuid";

// Icons
import { Send, Bot, Loader2, User } from "lucide-react";

export default function ChatWidget() {
  const { auth } = useContext(AuthContext);

  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! How can I help you today?" },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sessionIdRef = useRef(uuidv4());
  const messagesEndRef = useRef(null);

  // -------------------------------
  // 📌 PERFECT SCROLL FIX
  // -------------------------------
  useEffect(() => {
    const el = messagesEndRef.current;
    if (!el) return;

    // instant scroll
    el.scrollIntoView({ behavior: "auto" });

    // delayed smooth scroll
    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth" });
    }, 60);
  }, [messages]);

  // -------------------------------
  // 📌 SEND MESSAGE
  // -------------------------------
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");
    setLoading(true);

    // Add user bubble + loading bubble
    setMessages(prev => [
      ...prev,
      { role: "user", content: userText },
      { role: "assistant", content: "..." }
    ]);

    try {
      const res = await askAI({
        session_id: sessionIdRef.current,
        role: auth.role,
        user_id: auth.user_id || null,
        department: auth.department || null,
        message: userText,
      });

      let reply = "";

      if (res.route === "sql") {
        const rows = res.response?.data;

        if (rows?.length > 0) {
          reply = "Here are the results:\n\n";
          rows.forEach((row, i) => {
            reply += `${i + 1}. `;
            reply += Object.entries(row)
              .map(([k, v]) => `${k}: ${v}`)
              .join(", ");
            reply += "\n";
          });
        } else {
          reply = "No matching data found.";
        }
      } else if (typeof res.response === "string") {
        reply = res.response;
      } else {
        reply = "I'm not sure what you mean.";
      }

      // Replace loading bubble
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: reply
        };
        return updated;
      });

    } catch (err) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "❌ Failed to fetch response. Try again."
        };
        return updated;
      });
    }

    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col bg-background text-foreground transition-colors">

      {/* --------------------------------
          CHAT WINDOW
      --------------------------------- */}
      <div className="flex-1 chat-scroll p-4 space-y-4 
                      bg-muted/40 dark:bg-muted/20 
                      overflow-y-auto transition-color">

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* Avatar */}
            {m.role === "assistant" ? (
              <div className="p-2 bg-indigo-600 text-white rounded-full shadow">
                <Bot size={18} />
              </div>
            ) : (
              <div className="p-2 bg-gray-300 dark:bg-gray-700 
                              text-gray-800 dark:text-gray-200 
                              rounded-full shadow">
                <User size={18} />
              </div>
            )}

            {/* Bubble */}
            <div
              className={`max-w-[70%] p-3 rounded-xl whitespace-pre-wrap shadow
                transition-colors
                ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-card text-foreground border rounded-bl-none"
                }`}
            >
              {/* Show spinner for temporary bubble */}
              {i === messages.length - 1 && m.content === "..." && loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Thinking...
                </div>
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* --------------------------------
          INPUT BAR
      --------------------------------- */}
      <div className="p-3 border-t bg-card flex gap-2 sticky bottom-0 
                      transition-colors">
        <input
          className="input input-bordered w-full bg-background text-foreground"
          placeholder="Ask SmartCampus..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="btn btn-primary px-4 flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        </button>
      </div>

    </div>
  );
}
