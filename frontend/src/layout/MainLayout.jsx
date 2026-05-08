import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, Trophy, Users, GitCompare } from "lucide-react";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-emerald-600">EPL Analytics</h1>
        <p className="mt-2 text-sm text-slate-500">Premier League 2000–2026</p>

        <nav className="mt-10 space-y-3">
          <MenuLink to="/" icon={<BarChart3 size={20} />} text="Dashboard" />
          <MenuLink to="/teams" icon={<Users size={20} />} text="Teams" />
          <MenuLink to="/compare" icon={<GitCompare size={20} />} text="Compare Teams" />
          <MenuLink to="/seasons" icon={<Trophy size={20} />} text="Seasons" />
        </nav>
      </aside>

      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}

function MenuLink({ to, icon, text }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
          isActive
            ? "bg-emerald-600 text-white"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        }`
      }
    >
      {icon}
      {text}
    </NavLink>
  );
}