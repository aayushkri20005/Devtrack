import { useContext } from "react";
import { Store } from "../store";

export default function Settings() {
  const { settings, setSettings, resetAll } = useContext(Store);
  // Keep goals as whole numbers between 1 and the input's max
  const setGoal = (e) => setSettings({ ...settings, [e.target.name]: Math.min(e.target.max, Math.max(1, Math.round(e.target.value))) });

  return (
    <div className="card narrow">
      <label className="check">
        <input type="checkbox" checked={settings.dark} onChange={(e) => setSettings({ ...settings, dark: e.target.checked })} />
        Dark mode
      </label>
      <label>Daily problem goal
        <input name="dailyGoal" type="number" min={1} max={20} value={settings.dailyGoal} onChange={setGoal} />
      </label>
      <label>Daily study goal (minutes)
        <input name="studyGoal" type="number" min={1} max={720} value={settings.studyGoal} onChange={setGoal} />
      </label>

      <h3>Reset all data</h3>
      <p className="muted">Deletes solved problems, notes, study sessions, interview results, profile and settings from this browser.</p>
      <button className="btn danger" onClick={() => confirm("Delete all DevTrack data? This cannot be undone.") && resetAll()}>Reset all data</button>
    </div>
  );
}
