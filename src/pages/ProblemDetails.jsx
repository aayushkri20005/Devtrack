import { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Store } from "../store";
import { topicTags } from "../data/problems";
import { dayKey } from "../stats";

export default function ProblemDetails() {
  const { id } = useParams();
  const { problems, updateProblem } = useContext(Store);
  const problem = problems.find((p) => p.id === Number(id));
  const [note, setNote] = useState(problem?.note ?? "");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("devtrack_gemini_key") || "");
  const [problemStatement, setProblemStatement] = useState("");
  const [hints, setHints] = useState([]);
  const [loadingHint, setLoadingHint] = useState(false);
  const [hintError, setHintError] = useState("");
  const hintLevels = [10, 30, 60, 85, 100];
  const nextHintLevel = hintLevels[hints.length];

  if (!problem) {
    return <p>There is no problem with this number. <Link to="/problems">Back to all problems</Link></p>;
  }

  const { title, difficulty, topic, companies, solved, revision } = problem;

  async function getHint() {
    if (!apiKey.trim()) {
      setHintError("Add your Gemini API key first. It is saved only in this browser.");
      return;
    }
    if (nextHintLevel === undefined) return;

    setLoadingHint(true);
    setHintError("");
    localStorage.setItem("devtrack_gemini_key", apiKey.trim());

    const levelInstructions = {
      10: "Give only a tiny nudge: identify the key observation or ask one guiding question. Do not name the full algorithm and do not give code.",
      30: "Give a stronger hint about the useful data structure or algorithmic direction, but no complete steps and no code.",
      60: "Explain the main approach in a few steps, including why it works, but do not provide code.",
      85: "Give near-complete pseudocode or detailed implementation guidance, but not a full code solution.",
      100: "Now provide the complete solution in C++ with a short explanation and time/space complexity. Clearly label it as the full solution."
    };

    const prompt = `You are a patient DSA interview coach. Help the user solve this coding problem progressively without spoiling more than requested.
Problem title: ${title}
Difficulty: ${difficulty}
Topic: ${topic}
LeetCode URL: ${problem.url || `https://leetcode.com/problems/${problem.titleSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}/`}
${problemStatement.trim() ? `Problem statement supplied by user:
${problemStatement.trim()}
` : "If the title alone is ambiguous, ask the user to paste the problem statement instead of inventing details."}
"}
Hint strength: ${nextHintLevel}%
Instruction: ${levelInstructions[nextHintLevel]}
Keep the answer clear and concise. Do not reveal more than this hint level requests.`;

    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + encodeURIComponent(apiKey.trim()), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Gemini request failed. Check your API key and try again.");
      const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n").trim();
      if (!text) throw new Error("The AI returned an empty hint. Please try again.");
      setHints((current) => [...current, { level: nextHintLevel, text }]);
    } catch (error) {
      setHintError(error.message || "Could not get a hint. Check your connection and API key.");
    } finally {
      setLoadingHint(false);
    }
  }

  return (
    <div className="card narrow">
      <Link to="/problems" className="muted">Back to all problems</Link>
      <h2 className="big">{title}</h2>

      <div className="row">
        <span className={`badge ${difficulty}`}>{difficulty}</span>
        <span className="badge">{topic}</span>
        {solved && <span className="badge Easy">Solved</span>}
        {revision && <span className="badge Medium">Revise</span>}
      </div>

      <h3>Description</h3>
      <p>
        Solve "{title}", {difficulty === "Easy" ? "an" : "a"} {difficulty.toLowerCase()} problem on {topic}. Start with the brute-force idea,
        then improve it, and write down the time and space complexity of your final solution.
      </p>

      <h3>Companies</h3>
      <div className="row">{companies.map((c) => <span key={c} className="badge">{c}</span>)}</div>

      <h3>Tags</h3>
      <div className="row">{topicTags[topic].map((t) => <span key={t} className="badge">{t}</span>)}</div>

      <h3>AI Hint Coach</h3>
      <p className="muted">Get progressively stronger hints: 10% → 30% → 60% → 85% → full solution. Try each hint before asking for the next one.</p>
      <label>
        Gemini API key
        <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Paste your personal Gemini API key" autoComplete="off" />
      </label>
      <p className="muted">Get a key from Google AI Studio. It is stored only in this browser, not in your GitHub files. This is a personal-use setup: browser-side keys can be seen by someone with access to your browser/devtools.</p>
      <div className="row">
        <button className="btn" onClick={() => { localStorage.removeItem("devtrack_gemini_key"); setApiKey(""); }}>Forget saved key</button>
        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">Get a Gemini API key ↗</a>
      </div>
      <label>
        Problem statement (optional, improves hint accuracy)
        <textarea rows={3} value={problemStatement} onChange={(e) => setProblemStatement(e.target.value)} placeholder="Paste the LeetCode problem statement here if the hint needs more context" />
      </label>
      <div className="row">
        <button className="btn primary" onClick={getHint} disabled={loadingHint || nextHintLevel === undefined}>
          {loadingHint ? "Thinking..." : nextHintLevel === undefined ? "All hints used" : hints.length === 0 ? "Send Help · 10% hint" : `Next hint · ${nextHintLevel}%`}
        </button>
        {hints.length > 0 && <button className="btn" onClick={() => setHints([])} disabled={loadingHint}>Restart hints</button>}
      </div>
      {hintError && <p role="alert" style={{ color: "var(--red)" }}>{hintError}</p>}
      {hints.map((hint, index) => (
        <div className="answer" key={`${hint.level}-${index}`}>
          <strong>Hint {index + 1} · {hint.level === 100 ? "Full solution" : `${hint.level}%`}</strong>
          <p style={{ whiteSpace: "pre-wrap", marginTop: 8, marginBottom: 0 }}>{hint.text}</p>
        </div>
      ))}

      <h3>Note</h3>
      <textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Your approach, mistakes, or a link to your solution" />

      <div className="row">
        {solved ? (
          <button className="btn" onClick={() => updateProblem(problem.id, { solved: false, solvedOn: null }, `Marked "${title}" unsolved`)}>Mark unsolved</button>
        ) : (
          <button className="btn primary" onClick={() => updateProblem(problem.id, { solved: true, solvedOn: dayKey() }, `Solved "${title}"`)}>Mark solved</button>
        )}
        <button className="btn" onClick={() => updateProblem(problem.id, { revision: !revision }, revision ? "" : `Marked "${title}" for revision`)}>
          {revision ? "Remove from revision" : "Mark for revision"}
        </button>
        <button className="btn" onClick={() => updateProblem(problem.id, { note }, `Added a note to "${title}"`)}>Add note</button>
      </div>
    </div>
  );
}
