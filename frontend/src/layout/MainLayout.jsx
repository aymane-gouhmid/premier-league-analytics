import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, GitCompare, Trophy, Users } from "lucide-react";
import siteStadiumBg from "../assets/backgrounds/site-stadium-bg.webp";
import BrandLogo from "../components/BrandLogo";

const navItems = [
  { to: "/", icon: <BarChart3 size={18} />, text: "Dashboard" },
  { to: "/teams", icon: <Users size={18} />, text: "Teams" },
  { to: "/compare", icon: <GitCompare size={18} />, text: "Compare" },
  { to: "/seasons", icon: <Trophy size={18} />, text: "Seasons" },
];

export default function MainLayout() {
  return (
    <div className="app-shell relative min-h-screen overflow-x-hidden text-slate-900">
      <div
        className="site-stadium-bg pointer-events-none fixed inset-0"
        style={{ "--site-bg": `url(${siteStadiumBg})` }}
      />
      <div className="ambient-grid pointer-events-none fixed inset-0" />
      <div className="pitch-lines pointer-events-none fixed inset-x-0 top-24 h-[28rem] opacity-45" />
      <div className="pointer-events-none fixed inset-0 opacity-80">
        <div className="absolute left-[-10rem] top-[-10rem] h-[30rem] w-[30rem] rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="absolute right-[-12rem] top-16 h-[34rem] w-[34rem] rounded-full bg-teal-100/80 blur-3xl" />
        <div className="absolute bottom-[-18rem] left-1/3 h-[36rem] w-[36rem] rounded-full bg-slate-200/60 blur-3xl" />
      </div>

      <header className="fixed left-0 right-0 top-0 z-50 px-3 py-3 sm:px-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-[1.75rem] border border-white/70 bg-white/62 px-3 py-2 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.75)] backdrop-blur-2xl sm:px-4">
          <NavLink to="/" className="flex min-w-0 items-center gap-3">
            <BrandLogo className="h-11 w-11 shrink-0 drop-shadow-[0_18px_22px_rgba(15,118,110,0.22)]" />
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-base font-black tracking-tight text-slate-950">
                PL Analytics
              </p>
              <p className="truncate text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Football data studio
              </p>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-1 rounded-2xl bg-slate-950/5 p-1 md:flex">
            {navItems.map((item) => (
              <MenuLink key={item.to} {...item} />
            ))}
          </nav>

          <div className="hidden items-center gap-2 rounded-2xl border border-emerald-200/80 bg-emerald-50/80 px-3 py-2 text-sm font-bold text-emerald-700 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.9)]" />
            2000-2026
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto min-w-0 max-w-7xl px-4 pb-24 pt-24 sm:px-6 lg:px-8 lg:pb-12">
        <Outlet />
      </main>

      <nav className="fixed bottom-3 left-3 right-3 z-50 grid grid-cols-4 gap-1 rounded-[1.5rem] border border-white/70 bg-white/78 p-1.5 shadow-[0_-18px_50px_-38px_rgba(15,23,42,0.7)] backdrop-blur-2xl md:hidden">
        {navItems.map((item) => (
          <MobileLink key={item.to} {...item} />
        ))}
      </nav>
    </div>
  );
}

function MenuLink({ to, icon, text }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold transition-all duration-200 ${
          isActive
            ? "bg-white text-slate-950 shadow-sm"
            : "text-slate-500 hover:text-slate-950"
        }`
      }
    >
      {icon}
      {text}
    </NavLink>
  );
}

function MobileLink({ to, icon, text }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[0.68rem] font-bold transition-all ${
          isActive
            ? "bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
            : "text-slate-500"
        }`
      }
    >
      {icon}
      <span className="max-w-full truncate">{text}</span>
    </NavLink>
  );
}
