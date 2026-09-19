import { useContext } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Store } from "../store";
import { topics } from "../data/problems";
import { getStats, lastDays, shortDay } from "../stats";
import { Progress, Stat } from "../components/ui";

export default function Dashboard() {
  const { problems, sessions, results, activity, settings } = useContext(Store);
  const stats = getStats(problems, sessions, results);
  const solved = problems.filter((p) => p.solved);

  const week = lastDays(7).map((day) => ({
    day: shortDay(day),
    solved: solved.filter((p) => p.solvedOn === day).length,
  }));
  const today = week[6].solved;

  return (
    <>
      <div className="grid stats">
        <Stat label="Problems solved" value={stats.solved} />
        <Stat label="Current streak (days)" value={stats.streak} />
        <Stat label="Problems this week" value={stats.thisWeek} />
        <Stat label="Study hours" value={stats.studyHours} />
      </div>

      <div className="grid two">
        <section className="card">
          <h2>Today's goal</h2>
          <p className="goal">{today} / {settings.dailyGoal} problems</p>
          <div className="segments">
            {[...Array(settings.dailyGoal).keys()].map((i) => (
              <span key={i} className={i < today ? "on" : ""} />
            ))}
          </div>
          <p className="muted">{today >= settings.dailyGoal ? "Goal reached. Anything more is a bonus." : "Solve a problem to fill the next block."}</p>
        </section>

        <section className="card">
          <h2>Weekly activity</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={week}>
              <XAxis dataKey="day" stroke="var(--muted)" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} width={24} stroke="var(--muted)" tickLine={false} axisLine={false} />
              <Tooltip cursor={false} />
              <Bar dataKey="solved" fill="var(--accent)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      <div className="grid two">
        <section className="card">
          <h2>Topic progress</h2>
          {topics.map((topic) => {
            const total = problems.filter((p) => p.topic === topic).length;
            const done = solved.filter((p) => p.topic === topic).length;
            return (
              <div key={topic} className="topic-row">
                <span>{topic}</span>
                <span className="muted">{done}/{total}</span>
                <Progress value={done} max={total} />
              </div>
            );
          })}
        </section>

        <section className="card">
          <h2>Recent activity</h2>
          {activity.length === 0 && <p className="muted">Nothing yet. Open a problem and mark it solved.</p>}
          <ul className="list">
            {activity.slice(0, 8).map((a) => (
              <li key={a.date}>
                {a.text} <span className="muted">{new Date(a.date).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
