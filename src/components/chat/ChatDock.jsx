import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, X } from "lucide-react";
import Button from "../ui/Button.jsx";
import MessageBubble from "./MessageBubble.jsx";
import { buildViewPath } from "./NavigationCard.jsx";
import { api } from "../../lib/api.js";
import { useLanguage } from "../../i18n/LanguageProvider.jsx";

const SAMPLE_KEYS = [
  "chat.sample.forecast",
  "chat.sample.navigate",
  "chat.sample.churn",
  "chat.sample.trend",
];

function createThreadId() {
  return crypto.randomUUID();
}

export default function ChatDock({ onClose }) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [threadId, setThreadId] = useState(createThreadId);
  const [turns, setTurns] = useState([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const scrollRef = useRef(null);

  async function send(question) {
    const trimmed = question.trim();
    if (!trimmed || isSending) return;

    setTurns((previous) => [...previous, { role: "user", text: trimmed }]);
    setDraft("");
    setIsSending(true);
    setErrorMessage(null);

    try {
      const result = await api.post("/chat", {
        question: trimmed,
        thread_id: threadId,
        language,
      });
      setTurns((previous) => [...previous, { role: "assistant", result }]);

      const target = result?.navigation?.target;
      if (target?.dashboard_path) {
        navigate(buildViewPath(target));
      }
    } catch (caught) {
      setErrorMessage(caught.message);
    } finally {
      setIsSending(false);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }

  function resetConversation() {
    setThreadId(createThreadId());
    setTurns([]);
    setErrorMessage(null);
  }

  return (
    <section
      className="flex w-full max-w-md shrink-0 flex-col border-l border-hairline bg-canvas"
      aria-label="Advisor AI"
    >
      <header className="flex items-center justify-between gap-2 border-b border-hairline bg-surface px-4 py-3">
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold text-ink">
            {t("chat.title")}
          </p>
          <p className="truncate text-[11px] text-ink-faint">
            {t("chat.subtitle")}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" size="sm" onClick={resetConversation}>
            {t("chat.new")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onClose}
            aria-label={t("chat.close")}
          />
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {turns.length === 0 ? (
          <div className="space-y-2">
            <p className="text-xs text-ink-soft">{t("chat.samplesTitle")}</p>
            {SAMPLE_KEYS.map((sampleKey) => (
              <button
                key={sampleKey}
                type="button"
                onClick={() => send(t(sampleKey))}
                className="block w-full rounded-lg border border-hairline bg-surface px-3 py-2 text-left text-xs text-ink-soft transition-colors hover:border-primary hover:text-primary"
              >
                {t(sampleKey)}
              </button>
            ))}
          </div>
        ) : (
          turns.map((turn, index) => <MessageBubble key={index} turn={turn} />)
        )}

        {isSending ? (
          <p className="text-xs text-ink-faint" role="status">
            {t("chat.working")}
          </p>
        ) : null}

        {errorMessage ? (
          <p className="rounded-lg border border-danger/20 bg-red-50 px-3 py-2 text-xs text-danger">
            {errorMessage}
          </p>
        ) : null}
      </div>

      <form
        className="flex items-end gap-2 border-t border-hairline bg-surface p-3"
        onSubmit={(event) => {
          event.preventDefault();
          send(draft);
        }}
      >
        <label className="sr-only" htmlFor="chat-input">
          {t("chat.inputLabel")}
        </label>
        <textarea
          id="chat-input"
          rows={2}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send(draft);
            }
          }}
          placeholder={t("chat.placeholder")}
          className="min-h-[44px] flex-1 resize-none rounded-lg border border-hairline bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-primary"
        />
        <Button type="submit" icon={Send} disabled={isSending || !draft.trim()}>
          {t("chat.send")}
        </Button>
      </form>
    </section>
  );
}
