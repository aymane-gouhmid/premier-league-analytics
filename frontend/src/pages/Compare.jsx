import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import api from "../api/footballApi";

export default function Compare() {
  const [teams, setTeams] = useState([]);
  const [teamA, setTeamA] = useState("Arsenal");
  const [teamB, setTeamB] = useState("Chelsea");
  const [comparison, setComparison] = useState(null);
  const [h2h, setH2h] = useState(null);

  useEffect(() => {
    api.get("/teams").then((res) => setTeams(res.data));
  }, []);

  async function handleCompare() {
    const compareRes = await api.get(`/compare?team_a=${teamA}&team_b=${teamB}`);
    const h2hRes = await api.get(`/head-to-head?team_a=${teamA}&team_b=${teamB}`);

    setComparison(compareRes.data);
    setH2h(h2hRes.data);
  }

  const chartData = comparison
    ? [
        {
          stat: "Wins",
          [comparison.team_a.team]: comparison.team_a.wins,
          [comparison.team_b.team]: comparison.team_b.wins,
        },
        {
          stat: "Draws",
          [comparison.team_a.team]: comparison.team_a.draws,
          [comparison.team_b.team]: comparison.team_b.draws,
        },
        {
          stat: "Losses",
          [comparison.team_a.team]: comparison.team_a.losses,
          [comparison.team_b.team]: comparison.team_b.losses,
        },
        {
          stat: "Goals For",
          [comparison.team_a.team]: comparison.team_a.goals_scored,
          [comparison.team_b.team]: comparison.team_b.goals_scored,
        },
        {
          stat: "Goals Against",
          [comparison.team_a.team]: comparison.team_a.goals_conceded,
          [comparison.team_b.team]: comparison.team_b.goals_conceded,
        },
      ]
    : [];

  const h2hChartData = h2h
    ? [
        { name: `${h2h.team_a} Wins`, value: h2h.team_a_wins },
        { name: `${h2h.team_b} Wins`, value: h2h.team_b_wins },
        { name: "Draws", value: h2h.draws },
      ]
    : [];

  return (
    <div>
      <h1 className="text-4xl font-bold">Compare Teams</h1>
      <p className="mt-2 text-slate-500">
        Compare les performances historiques et les confrontations directes.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <select
          className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
          value={teamA}
          onChange={(e) => setTeamA(e.target.value)}
        >
          {teams.map((team) => (
            <option key={team}>{team}</option>
          ))}
        </select>

        <select
          className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
          value={teamB}
          onChange={(e) => setTeamB(e.target.value)}
        >
          {teams.map((team) => (
            <option key={team}>{team}</option>
          ))}
        </select>

        <button
          onClick={handleCompare}
          className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          Compare
        </button>
      </div>

      {comparison && (
        <>
          <section className="mt-8 grid grid-cols-2 gap-5">
            <TeamCard data={comparison.team_a} />
            <TeamCard data={comparison.team_b} />
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">Global Comparison</h2>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stat" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={comparison.team_a.team} />
                  <Bar dataKey={comparison.team_b.team} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      )}

      {h2h && (
        <>
          <section className="mt-8 grid grid-cols-5 gap-5">
            <StatCard title="H2H Matches" value={h2h.matches_played} />
            <StatCard title={`${h2h.team_a} Wins`} value={h2h.team_a_wins} />
            <StatCard title={`${h2h.team_b} Wins`} value={h2h.team_b_wins} />
            <StatCard title="Draws" value={h2h.draws} />
            <StatCard title="Goals" value={`${h2h.goals_team_a} - ${h2h.goals_team_b}`} />
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">Head-to-Head Results</h2>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={h2hChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function TeamCard({ data }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-emerald-600">{data.team}</h2>

      <div className="mt-5 grid grid-cols-3 gap-4">
        <Stat label="Played" value={data.played} />
        <Stat label="Wins" value={data.wins} />
        <Stat label="Draws" value={data.draws} />
        <Stat label="Losses" value={data.losses} />
        <Stat label="Goals For" value={data.goals_scored} />
        <Stat label="Goals Against" value={data.goals_conceded} />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <h3 className="mt-2 text-2xl font-bold">{value}</h3>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-2 text-2xl font-bold">{value}</h3>
    </div>
  );
}