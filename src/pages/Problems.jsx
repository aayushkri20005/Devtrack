import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Store } from "../store";
import { topics } from "../data/problems";
import companies from "../data/companies";

const levels = ["Easy", "Medium", "Hard"];

export default function Problems() {
  const { problems } = useContext(Store);
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

  return (
    <>
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
            <tr><th>#</th><th>Title</th><th>Difficulty</th><th>Topic</th><th>Companies</th><th>Status</th></tr>
          </thead>
          <tbody>
            {shown.map((p) => (
              <tr key={p.id}>
                <td className="muted">{p.id}</td>
                <td><Link to={`/problems/${p.id}`}>{p.title}</Link></td>
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
