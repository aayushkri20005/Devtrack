import { useContext, useState } from "react";
import { Store } from "../store";

const fields = [
  ["name", "Name", "text"],
  ["username", "Username", "text"],
  ["university", "University", "text"],
  ["year", "Graduation year", "number"],
  ["github", "GitHub", "url"],
  ["linkedin", "LinkedIn", "url"],
  ["codeforces", "Codeforces", "url"],
  ["codechef", "CodeChef", "url"],
];
const skills = ["C++", "JavaScript", "React", "DSA", "OOP", "DBMS", "Git"];

export default function Profile() {
  const { profile, setProfile } = useContext(Store);
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);

  function change(changes) {
    setForm({ ...form, ...changes });
    setSaved(false);
  }

  function save(e) {
    e.preventDefault();
    setProfile(form);
    setSaved(true);
  }

  return (
    <form className="card form-grid" onSubmit={save}>
      {fields.map(([key, label, type]) => (
        <label key={key}>{label}
          <input type={type} value={form[key] ?? ""} onChange={(e) => change({ [key]: e.target.value })}
            placeholder={type === "url" ? "https://" : ""} min={type === "number" ? 2000 : undefined} max={type === "number" ? 2100 : undefined} />
        </label>
      ))}
      <label className="wide">Bio
        <textarea rows={3} value={form.bio ?? ""} onChange={(e) => change({ bio: e.target.value })} />
      </label>

      <div className="wide">
        <p>Skills</p>
        <div className="row">
          {skills.map((skill) => {
            const has = form.skills.includes(skill);
            return (
              <button key={skill} type="button" aria-pressed={has} className={`btn chip ${has ? "primary" : ""}`}
                onClick={() => change({ skills: has ? form.skills.filter((s) => s !== skill) : [...form.skills, skill] })}>
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      <div className="row">
        <button className="btn primary">Save profile</button>
        {saved && <span className="muted">Profile saved</span>}
      </div>
    </form>
  );
}
