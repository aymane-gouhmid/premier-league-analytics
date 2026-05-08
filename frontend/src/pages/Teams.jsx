import { useEffect, useState } from "react";
import api from "../api/footballApi";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    api.get("/teams").then((res) => setTeams(res.data));
  }, []);

  async function handleSelectTeam(team) {
    const res = await api.get(`/teams/${team}`);
    setSelectedTeam(res.data);
  }

  const filteredTeams = teams.filter((team) =>
    team.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-4xl font-bold">Teams</h1>
      <p className="mt-2 text-slate-500">
        Explore les statistiques de chaque équipe.
      </p>

      <input
        className="mt-6 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500"
        placeholder="Search team..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {selectedTeam && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-emerald-600">
            {selectedTeam.team}
          </h2>

          <div className="mt-5 grid grid-cols-6 gap-4">
            <Stat label="Played" value={selectedTeam.played} />
            <Stat label="Wins" value={selectedTeam.wins} />
            <Stat label="Draws" value={selectedTeam.draws} />
            <Stat label="Losses" value={selectedTeam.losses} />
            <Stat label="Goals For" value={selectedTeam.goals_scored} />
            <Stat label="Goals Against" value={selectedTeam.goals_conceded} />
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-4 gap-4">
        {filteredTeams.map((team) => (
          <button
            key={team}
            onClick={() => handleSelectTeam(team)}
            className="rounded-2xl border border-slate-200 bg-white p-5 text-left font-semibold shadow-sm hover:border-emerald-500 hover:text-emerald-600"
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
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <h3 className="mt-2 text-2xl font-bold">{value}</h3>
    </div>
  );
}