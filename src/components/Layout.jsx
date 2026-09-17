import { useContext } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Building2, ChartLine, GraduationCap, Layers, LayoutDashboard, ListChecks, Moon, Settings, Sun, Timer, User } from "lucide-react";
import { Store } from "../store";

const links = [
  ["/", "Dashboard", LayoutDashboard],
  ["/problems", "Problems", ListChecks],
  ["/topics", "Topics", Layers],
  ["/companies", "Companies", Building2],
  ["/interview", "Interview Prep", GraduationCap],
  ["/study", "Study", Timer],
  ["/analytics", "Analytics", ChartLine],
  ["/profile", "Profile", User],
  ["/settings", "Settings", Settings],
];

export default function Layout() {
  const { settings, setSettings, profile } = useContext(Store);
  const { pathname } = useLocation();
  const title = links.find(([path]) => path === pathname)?.[1] ?? "Problem";

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="brand">DevTrack</div>
        {links.map(([path, label, Icon]) => (
          <NavLink key={path} to={path} end={path === "/"}>
            <Icon size={18} /> <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <header className="header">
        <h1>{title}</h1>
        <span className="muted">{profile.name}</span>
        <button className="btn icon" aria-label="Switch light or dark mode" onClick={() => setSettings({ ...settings, dark: !settings.dark })}>
          {settings.dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
