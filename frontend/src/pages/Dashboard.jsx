import { useEffect, useState } from "react";
import api from "../api/footballApi";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  async function fetchSummary() {
    try {
      const response = await api.get("/summary");
      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  if (!stats) {
    return (
      <div className="text-2xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Premier League Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Real-time EPL statistics from backend API.
        </p>
      </div>

      <section className="grid grid-cols-4 gap-5">
        <StatCard
          title="Saisons"
          value={stats.seasons}
          label="2000 - 2026"
        />

        <StatCard
          title="Équipes"
          value={stats.teams}
          label="clubs analysés"
        />

        <StatCard
          title="Matchs"
          value={stats.matches}
          label="historique EPL"
        />

        <StatCard
          title="Buts"
          value={stats.goals}
          label="goals scored"
        />
      </section>
    </div>
  );
}

function StatCard({ title, value, label }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h3 className="mt-3 text-3xl font-bold">
        {value}
      </h3>

      <p className="mt-2 text-sm text-emerald-600">
        {label}
      </p>
    </div>
  );
}