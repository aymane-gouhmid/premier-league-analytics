import { useEffect, useState } from "react";
import api from "../api/footballApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    api.get("/teams").then((res) => setTeams(res.data));
  }, []);

  async function handleSelectTeam(team) {
    const statsRes = await api.get(`/teams/${team}`);
    const historyRes = await api.get(`/teams/${team}/history`);

    setSelectedTeam({
      ...statsRes.data,
      history: historyRes.data,
    });
  }

  const filteredTeams = teams.filter((team) =>
    team.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-w-0">
      <h1 className="text-3xl font-bold sm:text-4xl">Teams</h1>
      <p className="mt-2 text-slate-500">
        Explore les statistiques de chaque équipe.
      </p>

      <input
        className="mt-6 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500"
        placeholder="Search team..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {selectedTeam && (
        <>
          <div className="mt-6 min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="break-words text-xl font-bold text-emerald-600 sm:text-2xl">
              {selectedTeam.team}
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
              <Stat label="Played" value={selectedTeam.played} />
              <Stat label="Wins" value={selectedTeam.wins} />
              <Stat label="Draws" value={selectedTeam.draws} />
              <Stat label="Losses" value={selectedTeam.losses} />
              <Stat label="Goals For" value={selectedTeam.goals_scored} />
              <Stat label="Goals Against" value={selectedTeam.goals_conceded} />
            </div>
          </div>

          <div className="mt-6 min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-xl font-bold sm:mb-6 sm:text-2xl">Points Evolution</h2>

            <div className="h-64 min-w-0 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedTeam.history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="season" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="points" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-8 lg:grid-cols-4 lg:gap-4">
        {filteredTeams.map((team) => (
          <button
            key={team}
            onClick={() => handleSelectTeam(team)}
            className="min-h-14 rounded-2xl border border-slate-200 bg-white p-4 text-left font-semibold shadow-sm hover:border-emerald-500 hover:text-emerald-600 sm:p-5"
          >
            {team}
          </button>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-3 sm:p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <h3 className="mt-2 break-words text-xl font-bold sm:text-2xl">{value}</h3>
    </div>
  );
}
