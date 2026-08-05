import ChartSpecRenderer from "./ChartSpecRenderer.jsx";
import Diagnostics from "./Diagnostics.jsx";
import Markdown from "./Markdown.jsx";
import NavigationCard from "./NavigationCard.jsx";

export default function MessageBubble({ turn }) {
  if (turn.role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-white">
          {turn.text}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl rounded-bl-sm border border-hairline bg-surface p-3.5">
      <Markdown>{turn.result.answer}</Markdown>
      {turn.result.chart_spec ? (
        <ChartSpecRenderer spec={turn.result.chart_spec} />
      ) : null}
      {turn.result.navigation ? (
        <NavigationCard navigation={turn.result.navigation} autoNavigated />
      ) : null}
      <Diagnostics result={turn.result} />
    </div>
  );
}
