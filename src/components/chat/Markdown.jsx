import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const COMPONENTS = {
  p: ({ children }) => <p className="leading-relaxed">{children}</p>,

  strong: ({ children }) => (
    <strong className="font-semibold text-ink">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  del: ({ children }) => (
    <del className="text-ink-faint line-through">{children}</del>
  ),

  h1: ({ children }) => (
    <h3 className="font-display text-base font-semibold text-ink">{children}</h3>
  ),
  h2: ({ children }) => (
    <h3 className="font-display text-sm font-semibold text-ink">{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className="font-display text-sm font-semibold text-ink">{children}</h4>
  ),
  h4: ({ children }) => (
    <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-ink-soft">
      {children}
    </h4>
  ),

  ul: ({ children }) => (
    <ul className="ml-4 list-disc space-y-1 marker:text-ink-faint">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="ml-4 list-decimal space-y-1 marker:text-ink-faint">{children}</ol>
  ),
  li: ({ children }) => <li className="pl-1 leading-relaxed">{children}</li>,

  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-primary underline underline-offset-2 hover:text-primary-dark"
    >
      {children}
    </a>
  ),

  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-primary/30 bg-primary-soft/40 py-1 pl-3 text-ink-soft">
      {children}
    </blockquote>
  ),

  hr: () => <hr className="border-hairline" />,

  code: ({ inline, children }) =>
    inline ? (
      <code className="numeric rounded bg-canvas px-1 py-0.5 text-[0.85em] text-primary">
        {children}
      </code>
    ) : (
      <code className="numeric block overflow-x-auto rounded-lg bg-ink px-3 py-2 text-[0.8em] leading-relaxed text-white">
        {children}
      </code>
    ),
  pre: ({ children }) => <pre className="my-1">{children}</pre>,

  table: ({ children }) => (
    <div className="overflow-x-auto rounded-lg border border-hairline">
      <table className="w-full border-collapse text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-canvas">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr className="border-b border-hairline/70 last:border-0">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
      {children}
    </th>
  ),
  td: ({ children }) => {
    const text = String(children);
    const isNumeric = /^[\d.,\s%+-]+$/.test(text.trim()) && /\d/.test(text);
    return (
      <td
        className={`px-3 py-2 text-ink ${isNumeric ? "numeric text-right" : ""}`}
      >
        {children}
      </td>
    );
  },
};

const LINE_BREAK_TAG = /<br\s*\/?>/gi;

function normalizeSource(raw) {
  return String(raw || "")
    .split("\n")
    .map((line) =>
      line.trimStart().startsWith("|")
        ? line.replace(LINE_BREAK_TAG, " · ")
        : line.replace(LINE_BREAK_TAG, "\n")
    )
    .join("\n");
}

export default function Markdown({ children, className = "" }) {
  return (
    <div className={`space-y-2 text-sm text-ink ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={COMPONENTS}>
        {normalizeSource(children)}
      </ReactMarkdown>
    </div>
  );
}
