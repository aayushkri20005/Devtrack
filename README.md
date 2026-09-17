# DevTrack

A personal dashboard for DSA and interview preparation. It runs fully in the browser and saves everything to `localStorage`. There is no backend.

## Features

- **Dashboard** with solved count, streak, problems this week, study hours, weekly chart, topic progress, recent activity and today's goal
- **Problems**: 100 DSA problems with search, four filters and sorting
- **Problem details**: mark solved or unsolved, mark for revision, add a note
- **Topics** and **Companies**: progress calculated from the real problem data
- **Interview Prep**: pick a category, difficulty and question count, practise one question at a time, get a score
- **Study**: add, edit and delete study sessions, plus a 25/5 Pomodoro timer
- **Analytics**: streaks, interview accuracy and four charts
- **Profile** and **Settings**: light/dark mode, daily goals, reset all data

## Tech stack

React 18, Vite, React Router, Recharts, Lucide icons, plain CSS.

## Installation and running

```bash
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

## Project structure

```text
src/
  main.jsx          starts the app
  App.jsx           all routes
  store.jsx         one Context holding all data, saved to localStorage
  stats.js          date helpers and the streak / stats calculation
  index.css         all styles, light and dark colours
  components/
    Layout.jsx      sidebar, header, mobile navigation
    ui.jsx          Stat, Progress, ProgressTable
  pages/            one file per page
  data/             problems, companies, interview questions
```

## How the data works

- `store.jsx` has a small `useStored(key, initial)` hook. It is `useState` plus one `localStorage.setItem`.
- Marking a problem solved sets `solved: true` and `solvedOn: "YYYY-MM-DD"`. The dashboard, topics, companies, streak and charts are all calculated from that, so nothing is stored twice.
- A day counts towards the streak when at least one problem has that `solvedOn` date.

## Future improvements

- Links to the real problem statements
- Import and export data as a JSON file
- Spaced-repetition reminders for problems marked for revision
- More interview questions
