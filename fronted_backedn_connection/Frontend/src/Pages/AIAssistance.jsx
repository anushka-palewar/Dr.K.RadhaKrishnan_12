import { useState } from "react";
import { sendQuestion } from "../api/aiApi";
import "./AIAssistance.css";

export default function AIAssistance() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setLoading(true);
    setError(null);

    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      { role: "user", content: question, response: null },
    ]);
    setInput("");

    try {
      const response = await sendQuestion(question);

      // Build assistant message from API response
      let assistantContent = "";
      if (response.interpretation?.answer) {
        const a = response.interpretation.answer;
        assistantContent = [
          a.direct_answer && `**Answer:** ${a.direct_answer}`,
          a.supporting_details && `**Details:** ${a.supporting_details}`,
          a.insights && `**Insights:** ${a.insights}`,
        ]
          .filter(Boolean)
          .join("\n\n");
      }
      if (!assistantContent && response.insight) {
        assistantContent = response.insight;
      }
      if (!assistantContent && response.result?.error) {
        assistantContent = `Execution error: ${response.result.error}`;
      }
      if (!assistantContent && !response.valid) {
        assistantContent = response.insight || "Could not generate valid SQL. Try rephrasing.";
      }
      if (!assistantContent) {
        assistantContent = "No response generated.";
      }

      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role === "user" && last?.response === null) {
          next[next.length - 1] = {
            ...last,
            response: {
              content: assistantContent,
              sql: response.sql,
              valid: response.valid,
              executionTime: response.result?.executionTime,
            },
          };
        }
        return next;
      });
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "Request failed.";
      setError(message);
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role === "user" && last?.response === null) {
          next[next.length - 1] = {
            ...last,
            response: { content: `Error: ${message}`, sql: null, valid: false },
          };
        }
        return next;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ai-assistance">
      <header className="ai-assistance-header">
        <h1>AI Assistance</h1>
        <p>
          Ask questions about service operations analytics (e.g. SLA breaches,
          resolution time by category, department requests). Answers are powered
          by SQL generation and your database.
        </p>
      </header>

      <div className="ai-assistance-chat">
        <div className="ai-chat-messages">
          {messages.length === 0 && (
            <div className="ai-chat-placeholder">
              <p>Type a question and press Send.</p>
              <p className="ai-chat-hint">
                Example: &quot;Which team breached SLA the most?&quot;
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`ai-message ai-message-${msg.role}`}>
              <div className="ai-message-user">{msg.content}</div>
              {msg.response && (
                <div className="ai-message-assistant">
                  {msg.response.sql && (
                    <pre className="ai-sql-block">{msg.response.sql}</pre>
                  )}
                  <div className="ai-response-text">{msg.response.content}</div>
                  {msg.response.executionTime != null && (
                    <span className="ai-meta">
                      Executed in {msg.response.executionTime}ms
                    </span>
                  )}
                </div>
              )}
              {msg.role === "user" && !msg.response && loading && (
                <div className="ai-message-assistant ai-loading">
                  Thinking…
                </div>
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="ai-error" role="alert">
            {error}
          </div>
        )}

        <form className="ai-chat-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about service analytics..."
            disabled={loading}
            className="ai-chat-input"
            aria-label="Question"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="ai-chat-send"
          >
            {loading ? "Sending…" : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
