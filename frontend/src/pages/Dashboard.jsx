import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Activity } from "lucide-react";
import { summaryStats, goalsBySeason, topTeams } from "../data/mockData";

export default function Dashboard() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Premier League Dashboard</h1>
          <p className="mt-2 text-slate-500">
            Analyse interactive des équipes, saisons et performances.
          </p>
        </div>

        <button className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-emerald-700">
          Export Report
        </button>
      </div>

      <section className="grid grid-cols-4 gap-5">
        {summaryStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="mt-8 grid grid-cols-3 gap-5">
        <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <Activity className="text-emerald-600" />
            <h3 className="text-xl font-semibold">Buts par saison</h3>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={goalsBySeason}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="season" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="goals" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold">Top Teams</h3>

          <div className="mt-6 space-y-4">
            {topTeams.map((team) => (
              <TeamRow key={team.name} {...team} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, label }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-3 text-3xl font-bold">{value}</h3>
      <p className="mt-2 text-sm text-emerald-600">{label}</p>
    </div>
  );
}

function TeamRow({ name, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-slate-500">{value}</p>
      </div>
      <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
    </div>
  );
}