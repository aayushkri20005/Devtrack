const DAY = 24 * 60 * 60 * 1000;

// "2026-09-17" in the user's own timezone
export const dayKey = (date = new Date()) => new Date(date).toLocaleDateString("en-CA");
export const daysAgo = (n) => dayKey(Date.now() - n * DAY);
export const lastDays = (n) => [...Array(n).keys()].map(daysAgo).reverse();
export const shortDay = (key) => new Date(key + "T12:00").toLocaleDateString("en", { weekday: "short" });

// Every number shown on the Dashboard and Analytics pages comes from here.
export function getStats(problems, sessions, results) {
  const solved = problems.filter((p) => p.solved);
  const activeDays = [...new Set(solved.map((p) => p.solvedOn))].sort();

  // Current streak: walk back from today (or yesterday, if nothing is solved yet today).
  let streak = 0;
  for (let i = activeDays.includes(daysAgo(0)) ? 0 : 1; activeDays.includes(daysAgo(i)); i++) streak++;

  // Longest streak: count runs of back-to-back days.
  let longest = 0;
  let run = 0;
  activeDays.forEach((day, i) => {
    const dayAfterPrevious = i > 0 && dayKey(new Date(activeDays[i - 1] + "T12:00").getTime() + DAY);
    run = dayAfterPrevious === day ? run + 1 : 1;
    longest = Math.max(longest, run);
  });

  const attempted = results.reduce((sum, r) => sum + r.attempted, 0);
  const score = results.reduce((sum, r) => sum + r.score, 0);

  return {
    solved: solved.length,
    streak,
    longest,
    thisWeek: solved.filter((p) => p.solvedOn >= daysAgo(6)).length,
    studyHours: +(sessions.reduce((sum, s) => sum + s.duration, 0) / 60).toFixed(1),
    accuracy: attempted ? Math.round((score / attempted) * 100) : 0,
  };
}
