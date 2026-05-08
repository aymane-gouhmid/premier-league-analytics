import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, Trophy, Users, GitCompare } from "lucide-react";

export default function MainLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100 text-slate-900">
      <aside className="fixed bottom-0 left-0 z-50 w-full border-t border-slate-200 bg-white px-2 py-2 lg:bottom-auto lg:top-0 lg:h-full lg:w-64 lg:border-r lg:border-t-0 lg:p-6">
        <div className="hidden lg:block">
          <h1 className="text-2xl font-bold text-emerald-600">EPL Analytics</h1>
          <p className="mt-2 text-sm text-slate-500">
            Premier League 2000–2026
          </p>
        </div>

        <nav className="grid grid-cols-4 gap-1 sm:gap-2 lg:mt-10 lg:block lg:space-y-3">
          <MenuLink to="/" icon={<BarChart3 size={20} />} text="Dashboard" />
          <MenuLink to="/teams" icon={<Users size={20} />} text="Teams" />
          <MenuLink to="/compare" icon={<GitCompare size={20} />} text="Compare" />
          <MenuLink to="/seasons" icon={<Trophy size={20} />} text="Seasons" />
        </nav>
      </aside>

      <main className="min-w-0 p-4 pb-24 sm:p-5 lg:ml-64 lg:p-8">
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
        `flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-xs font-medium sm:px-2 lg:flex-row lg:justify-start lg:gap-3 lg:px-4 lg:py-3 lg:text-sm ${
          isActive
            ? "bg-emerald-600 text-white"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        }`
      }
    >
      {icon}
      <span className="max-w-full truncate">{text}</span>
    </NavLink>
  );
}
