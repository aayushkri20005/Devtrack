import { useContext, useEffect, useState } from "react";
import { Store } from "../store";
import { topics } from "../data/problems";
import { dayKey } from "../stats";
import { Progress } from "../components/ui";

const FOCUS = 25 * 60;
const BREAK = 5 * 60;

function Pomodoro() {
  const [isBreak, setIsBreak] = useState(false);
  const [seconds, setSeconds] = useState(FOCUS);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [running]);

  // When the time runs out, switch between focus and break
  useEffect(() => {
    if (seconds > 0) return;
    setSeconds(isBreak ? FOCUS : BREAK);
    setIsBreak(!isBreak);
  }, [seconds, isBreak]);

  const time = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <section className="card timer">
      <h2>{isBreak ? "5 min break" : "25 min focus"}</h2>
      <strong>{time}</strong>
      <div className="row">
        <button className="btn primary" onClick={() => setRunning(!running)}>{running ? "Pause" : "Start"}</button>
        <button className="btn" onClick={() => { setRunning(false); setIsBreak(false); setSeconds(FOCUS); }}>Reset</button>
      </div>
    </section>
  );
}

const empty = { date: dayKey(), topic: topics[0], duration: 30, problems: 0, notes: "" };

export default function Study() {
  const { sessions, setSessions, settings } = useContext(Store);
  const [form, setForm] = useState(empty);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.type === "number" ? Number(e.target.value) : e.target.value });

  function save(e) {
    e.preventDefault();
    setSessions(form.id ? sessions.map((s) => (s.id === form.id ? form : s)) : [{ ...form, id: Date.now() }, ...sessions]);
    setForm(empty);
  }

  const todayMinutes = sessions.filter((s) => s.date === dayKey()).reduce((sum, s) => sum + s.duration, 0);

  return (
    <>
      <div className="grid two">
        <Pomodoro />
        <section className="card">
          <h2>Today's study goal</h2>
          <p className="goal">{todayMinutes} / {settings.studyGoal} min</p>
          <Progress value={todayMinutes} max={settings.studyGoal} />
        </section>
      </div>

      <form className="card form-grid" onSubmit={save}>
        <h2>{form.id ? "Edit session" : "Add a study session"}</h2>
        <label>Date <input name="date" type="date" required max={dayKey()} value={form.date} onChange={change} /></label>
        <label>Topic <select name="topic" value={form.topic} onChange={change}>{topics.map((t) => <option key={t}>{t}</option>)}</select></label>
        <label>Duration (minutes) <input name="duration" type="number" required min={1} max={720} value={form.duration} onChange={change} /></label>
        <label>Problems solved <input name="problems" type="number" required min={0} value={form.problems} onChange={change} /></label>
        <label className="wide">Notes <textarea name="notes" rows={2} value={form.notes} onChange={change} /></label>
        <div className="row">
          <button className="btn primary">{form.id ? "Save changes" : "Add session"}</button>
          {form.id && <button type="button" className="btn" onClick={() => setForm(empty)}>Cancel</button>}
        </div>
      </form>

      <section className="card table-wrap">
        <h2>Previous sessions</h2>
        {sessions.length === 0 ? <p className="muted">No sessions yet. Add your first one above.</p> : (
          <table>
            <thead><tr><th>Date</th><th>Topic</th><th>Minutes</th><th>Problems</th><th>Notes</th><th></th></tr></thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id}>
                  <td>{s.date}</td><td>{s.topic}</td><td>{s.duration}</td><td>{s.problems}</td><td className="muted">{s.notes}</td>
                  <td className="row">
                    <button className="btn" onClick={() => setForm(s)}>Edit</button>
                    <button className="btn danger" onClick={() => confirm("Delete this session?") && setSessions(sessions.filter((x) => x.id !== s.id))}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
