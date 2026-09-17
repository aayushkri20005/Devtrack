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

  if (!problem) {
    return <p>There is no problem with this number. <Link to="/problems">Back to all problems</Link></p>;
  }

  const { title, difficulty, topic, companies, solved, revision } = problem;

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
