import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import api from "../api/footballApi";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [goalsBySeason, setGoalsBySeason] = useState([]);
  const [topTeams, setTopTeams] = useState([]);

  useEffect(() => {
    api.get("/summary").then((res) => setStats(res.data));
    api.get("/analytics/goals-by-season").then((res) => setGoalsBySeason(res.data));
    api.get("/analytics/top-teams").then((res) => setTopTeams(res.data));
  }, []);

  if (!stats) return <div className="text-2xl font-bold">Loading...</div>;

  return (
    <div>
      <h1 className="text-4xl font-bold">Premier League Dashboard</h1>
      <p className="mt-2 text-slate-500">
        Real EPL statistics from 2000 to 2026.
      </p>

      <section className="mt-8 grid grid-cols-4 gap-5">
        <StatCard title="Saisons" value={stats.seasons} />
        <StatCard title="Équipes" value={stats.teams} />
        <StatCard title="Matchs" value={stats.matches} />
        <StatCard title="Buts" value={stats.goals} />
      </section>

      <section className="mt-8 grid grid-cols-2 gap-5">
        <ChartCard title="Goals by Season">
          <LineChart data={goalsBySeason}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="season" />
            <YAxis />
            <Tooltip />
            <Line dataKey="goals" />
          </LineChart>
        </ChartCard>

        <ChartCard title="Top 10 Teams by Wins">
          <BarChart data={topTeams}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="team" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="wins" />
          </BarChart>
        </ChartCard>
      </section>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-3 text-3xl font-bold">{value}</h3>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}