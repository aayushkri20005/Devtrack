import { useContext, useState } from "react";
import { Store } from "../store";
import questions, { categories } from "../data/questions";
import { Stat } from "../components/ui";

export default function Interview() {
  const { results, setResults } = useContext(Store);
  const [setup, setSetup] = useState({ category: categories[0], difficulty: "", count: 5 });
  const [list, setList] = useState(null); // questions in the current practice, null when not practising
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionIndex: true | false }
  const [review, setReview] = useState([]); // question indexes marked for review
  const [showAnswer, setShowAnswer] = useState(false);
  const [result, setResult] = useState(null);

  const change = (e) => setSetup({ ...setup, [e.target.name]: e.target.value });

  function start(e) {
    e.preventDefault();
    const picked = questions
      .filter((q) => q.category === setup.category && (!setup.difficulty || q.difficulty === setup.difficulty))
      .sort(() => Math.random() - 0.5)
      .slice(0, setup.count);
    setList(picked);
    setIndex(0);
    setAnswers({});
    setReview([]);
    setShowAnswer(false);
    setResult(null);
  }

  function go(step) {
    setIndex(index + step);
    setShowAnswer(false);
  }

  function finish() {
    const attempted = Object.keys(answers).length;
    const score = Object.values(answers).filter(Boolean).length;
    const newResult = {
      date: new Date().toISOString(),
      category: setup.category,
      questions: list.length,
      attempted,
      skipped: list.length - attempted,
      score,
      accuracy: attempted ? Math.round((score / attempted) * 100) : 0,
    };
    setResults([newResult, ...results]);
    setResult(newResult);
    setList(null);
  }

  // 1. A practice is running: show one question at a time
  if (list) {
    const q = list[index];
    if (!q) return <p>No questions match this category and difficulty. <button className="btn" onClick={() => setList(null)}>Change selection</button></p>;

    return (
      <div className="card narrow">
        <p className="muted">Question {index + 1} of {list.length} in {q.category}</p>
        <div className="row">
          <span className={`badge ${q.difficulty}`}>{q.difficulty}</span>
          {review.includes(index) && <span className="badge Medium">Review</span>}
        </div>
        <h2 className="big">{q.question}</h2>

        {showAnswer && (
          <>
            <p className="answer">{q.answer}</p>
            <div className="row">
              <span className="muted">Did you know it?</span>
              <button className={`btn ${answers[index] === true ? "primary" : ""}`} onClick={() => setAnswers({ ...answers, [index]: true })}>Yes</button>
              <button className={`btn ${answers[index] === false ? "primary" : ""}`} onClick={() => setAnswers({ ...answers, [index]: false })}>No</button>
            </div>
          </>
        )}

        <div className="row">
          <button className="btn" disabled={index === 0} onClick={() => go(-1)}>Previous</button>
          <button className="btn" disabled={index === list.length - 1} onClick={() => go(1)}>Next</button>
          <button className="btn" onClick={() => setShowAnswer(!showAnswer)}>{showAnswer ? "Hide answer" : "Show answer"}</button>
          <button className="btn" onClick={() => setReview(review.includes(index) ? review.filter((i) => i !== index) : [...review, index])}>
            {review.includes(index) ? "Remove review mark" : "Mark for review"}
          </button>
          <button className="btn primary" onClick={finish}>Finish practice</button>
        </div>
      </div>
    );
  }

  // 2. Not practising: show the last result (if any), the setup form, and past results
  return (
    <>
      {result && (
        <div className="grid stats">
          <Stat label="Questions" value={result.questions} />
          <Stat label="Attempted" value={result.attempted} />
          <Stat label="Skipped" value={result.skipped} />
          <Stat label="Score" value={`${result.score} / ${result.questions}`} />
          <Stat label="Accuracy" value={`${result.accuracy}%`} />
        </div>
      )}

      <form className="card narrow" onSubmit={start}>
        <h2>Start a practice</h2>
        <label>Category
          <select name="category" value={setup.category} onChange={change}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
        <label>Difficulty
          <select name="difficulty" value={setup.difficulty} onChange={change}>
            <option value="">Any</option><option>Easy</option><option>Medium</option><option>Hard</option>
          </select>
        </label>
        <label>Number of questions
          <input name="count" type="number" min={1} max={6} required value={setup.count} onChange={change} />
        </label>
        <button className="btn primary">Start practice</button>
      </form>

      <section className="card table-wrap">
        <h2>Past results</h2>
        {results.length === 0 ? <p className="muted">Finish a practice to see your results here.</p> : (
          <table>
            <thead><tr><th>Date</th><th>Category</th><th>Questions</th><th>Attempted</th><th>Score</th><th>Accuracy</th></tr></thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.date}>
                  <td>{new Date(r.date).toLocaleDateString()}</td><td>{r.category}</td><td>{r.questions}</td>
                  <td>{r.attempted}</td><td>{r.score}</td><td>{r.accuracy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
