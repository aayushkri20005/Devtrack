import { useContext } from "react";
import { Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Store } from "../store";
import { topics } from "../data/problems";
import { getStats, lastDays } from "../stats";
import { Stat } from "../components/ui";

const levels = ["Easy", "Medium", "Hard"];
const levelColors = ["var(--green)", "var(--amber)", "var(--red)"];
const axis = { stroke: "var(--muted)", tickLine: false, axisLine: false };

export default function Analytics() {
  const { problems, sessions, results } = useContext(Store);
  const stats = getStats(problems, sessions, results);
  const solved = problems.filter((p) => p.solved);

  const days = lastDays(14);
  const overTime = days.map((day) => ({ day: day.slice(5), solved: solved.filter((p) => p.solvedOn <= day).length }));
  const studyHours = days.map((day) => ({
    day: day.slice(5),
    hours: +(sessions.filter((s) => s.date === day).reduce((sum, s) => sum + s.duration, 0) / 60).toFixed(1),
  }));
  const byDifficulty = levels.map((name) => ({ name, value: solved.filter((p) => p.difficulty === name).length }));
  const byTopic = topics.map((name) => ({ name, solved: solved.filter((p) => p.topic === name).length }));

  return (
    <>
      <div className="grid stats">
        <Stat label="Problems solved" value={stats.solved} />
        <Stat label="Current streak (days)" value={stats.streak} />
        <Stat label="Longest streak (days)" value={stats.longest} />
        <Stat label="Study hours" value={stats.studyHours} />
        <Stat label="Problems this week" value={stats.thisWeek} />
        <Stat label="Interview accuracy" value={`${stats.accuracy}%`} />
      </div>

      <div className="grid two">
        <section className="card">
          <h2>Problems solved over time</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={overTime}>
              <XAxis dataKey="day" {...axis} />
              <YAxis allowDecimals={false} width={28} {...axis} />
              <Tooltip />
              <Line dataKey="solved" stroke="var(--accent)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="card">
          <h2>Solved by difficulty</h2>
          {solved.length === 0 ? <p className="muted">Solve a problem to see the split.</p> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={byDifficulty} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} isAnimationActive={false} label={(d) => `${d.name} ${d.value}`}>
                  {levelColors.map((color) => <Cell key={color} fill={color} stroke="var(--surface)" />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="card">
          <h2>Solved by topic</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byTopic} layout="vertical">
              <XAxis type="number" allowDecimals={false} {...axis} />
              <YAxis type="category" dataKey="name" width={140} {...axis} />
              <Tooltip cursor={false} />
              <Bar dataKey="solved" fill="var(--accent)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="card">
          <h2>Study hours</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studyHours}>
              <XAxis dataKey="day" {...axis} />
              <YAxis width={28} {...axis} />
              <Tooltip cursor={false} />
              <Bar dataKey="hours" fill="var(--amber)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>
    </>
  );
}
