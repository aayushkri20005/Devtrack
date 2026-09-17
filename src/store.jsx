import { createContext, useEffect, useState } from "react";
import mockProblems from "./data/problems";

export const Store = createContext();

// useState that also saves to localStorage. Used for every piece of app data.
function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

export function StoreProvider({ children }) {
  const [problems, setProblems] = useStored("problems", mockProblems);
  const [activity, setActivity] = useStored("activity", []);
  const [sessions, setSessions] = useStored("sessions", []);
  const [results, setResults] = useStored("results", []);
  const [profile, setProfile] = useStored("profile", { skills: [] });
  const [settings, setSettings] = useStored("settings", { dark: false, dailyGoal: 5, studyGoal: 60 });

  useEffect(() => {
    document.documentElement.dataset.theme = settings.dark ? "dark" : "light";
  }, [settings.dark]);

  // Change one problem and, if text is given, log it in recent activity.
  function updateProblem(id, changes, text) {
    setProblems(problems.map((p) => (p.id === id ? { ...p, ...changes } : p)));
    if (text) setActivity([{ text, date: new Date().toISOString() }, ...activity].slice(0, 30));
  }

  function resetAll() {
    localStorage.clear();
    location.reload();
  }

  const value = {
    problems, updateProblem, activity,
    sessions, setSessions,
    results, setResults,
    profile, setProfile,
    settings, setSettings,
    resetAll,
  };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
