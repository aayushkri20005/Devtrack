import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Store } from "../store";
import { topics } from "../data/problems";
import companies from "../data/companies";

const levels = ["Easy", "Medium", "Hard"];

export default function Problems() {
  const { problems, setProblems } = useContext(Store);
  const [loadingLeetCode, setLoadingLeetCode] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [f, setF] = useState({ search: "", difficulty: "", topic: "", company: "", status: "", sort: "id" });
  const change = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const shown = problems
    .filter((p) => p.title.toLowerCase().includes(f.search.toLowerCase()))
    .filter((p) => !f.difficulty || p.difficulty === f.difficulty)
    .filter((p) => !f.topic || p.topic === f.topic)
    .filter((p) => !f.company || p.companies.includes(f.company))
    .filter((p) => !f.status || p.solved === (f.status === "solved"))
    .sort((a, b) =>
      f.sort === "title" ? a.title.localeCompare(b.title)
      : f.sort === "difficulty" ? levels.indexOf(a.difficulty) - levels.indexOf(b.difficulty)
      : a.id - b.id
    );

  const options = (list) => list.map((x) => <option key={x}>{x}</option>);

  async function loadLeetCodeQuestions() {
    setLoadingLeetCode(true);
    setApiMessage("");
    try {
      const response = await fetch("https://alfa-leetcode-api.onrender.com/problems?limit=3000");
      if (!response.ok) throw new Error("LeetCode question service is unavailable.");
      const data = await response.json();
      const list = Array.isArray(data) ? data : data.problemsetQuestionList || data.problems || data.questions || [];
      if (!list.length) throw new Error("No questions were returned. Try again later.");
      const existingBySlug = new Map(problems.map((p) => [p.titleSlug || slugify(p.title), p]));
      const imported = list.map((q, i) => {
        const title = q.title || q.titleName || q.name;
        const titleSlug = q.titleSlug || q.slug || slugify(title || "");
        const old = existingBySlug.get(titleSlug);
        const rawDifficulty = q.difficulty || q.level || "Easy";
        const difficulty = ["Easy", "Medium", "Hard"].find((d) => d.toLowerCase() === String(rawDifficulty).toLowerCase()) || "Easy";
        return {
          ...(old || {}),
          id: old?.id ?? (Number(q.questionFrontendId || q.frontendQuestionId || q.id) || i + 1),
          title: title || old?.title || titleSlug,
          titleSlug,
          url: `https://leetcode.com/problems/${titleSlug}/`,
          difficulty,
          topic: old?.topic || (q.topicTags?.[0]?.name) || "LeetCode",
          companies: old?.companies || [],
          solved: old?.solved || false,
          revision: old?.revision || false,
        };
      }).filter((p) => p.title && p.titleSlug);
      const merged = new Map();
      [...imported, ...problems].forEach((p) => {
        const slug = p.titleSlug || slugify(p.title);
        const prior = merged.get(slug);
        merged.set(slug, { ...p, ...prior, titleSlug: slug, url: p.url || `https://leetcode.com/problems/${slug}/` });
      });
      setProblems([...merged.values()].sort((a, b) => a.title.localeCompare(b.title)).map((p, index) => ({ ...p, id: index + 1 })));
      setApiMessage(`Loaded ${imported.length} LeetCode questions. Your existing progress was kept where titles matched.`);
    } catch (error) {
      setApiMessage(`${error.message} Your saved questions are still available; their LeetCode links are shown below.`);
    } finally {
      setLoadingLeetCode(false);
    }
  }

  function slugify(title = "") {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  return (
    <>
      <div className="row" style={{ marginBottom: 12, alignItems: "center" }}>
        <button className="btn primary" onClick={loadLeetCodeQuestions} disabled={loadingLeetCode}>
          {loadingLeetCode ? "Loading LeetCode questions..." : "Fetch LeetCode questions"}
        </button>
        <span className="muted">Loads questions from a public community API.</span>
      </div>
      {apiMessage && <p className="muted" role="status">{apiMessage}</p>}

      <div className="card filters">
        <input name="search" type="search" placeholder="Search problems" value={f.search} onChange={change} />
        <select name="difficulty" value={f.difficulty} onChange={change}><option value="">All difficulties</option>{options(levels)}</select>
        <select name="topic" value={f.topic} onChange={change}><option value="">All topics</option>{options(topics)}</select>
        <select name="company" value={f.company} onChange={change}><option value="">All companies</option>{options(companies)}</select>
        <select name="status" value={f.status} onChange={change}>
          <option value="">Solved and unsolved</option>
          <option value="solved">Solved</option>
          <option value="unsolved">Unsolved</option>
        </select>
        <select name="sort" value={f.sort} onChange={change}>
          <option value="id">Sort by number</option>
          <option value="title">Sort by title</option>
          <option value="difficulty">Sort by difficulty</option>
        </select>
      </div>

      <p className="muted">{shown.length} of {problems.length} problems</p>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr><th>#</th><th>Title</th><th>LeetCode</th><th>Difficulty</th><th>Topic</th><th>Companies</th><th>Status</th></tr>
          </thead>
          <tbody>
            {shown.map((p) => (
              <tr key={p.id}>
                <td className="muted">{p.id}</td>
                <td><Link to={`/problems/${p.id}`}>{p.title}</Link></td>
                <td><a href={p.url || `https://leetcode.com/problems/${p.titleSlug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}/`} target="_blank" rel="noreferrer">Open ↗</a></td>
                <td><span className={`badge ${p.difficulty}`}>{p.difficulty}</span></td>
                <td>{p.topic}</td>
                <td className="muted">{p.companies.join(", ")}</td>
                <td>
                  {p.solved && <span className="badge Easy">Solved</span>}
                  {p.revision && <span className="badge Medium">Revise</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <p className="muted">No problems match these filters.</p>}
      </div>
    </>
  );
}
