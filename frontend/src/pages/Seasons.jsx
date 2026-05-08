import { useEffect, useState } from "react";
import api from "../api/footballApi";

export default function Seasons() {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [seasonStats, setSeasonStats] = useState(null);

  useEffect(() => {
    api.get("/seasons").then((res) => {
      setSeasons(res.data);
      setSelectedSeason(res.data[res.data.length - 1]);
    });
  }, []);

  useEffect(() => {
    if (selectedSeason) {
      api.get(`/seasons/${selectedSeason}`).then((res) => {
        setSeasonStats(res.data);
      });
    }
  }, [selectedSeason]);

  return (
    <div>
      <h1 className="text-4xl font-bold">Seasons</h1>
      <p className="mt-2 text-slate-500">
        Explore les statistiques de chaque saison Premier League.
      </p>

      <select
        className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500"
        value={selectedSeason}
        onChange={(e) => setSelectedSeason(e.target.value)}
      >
        {seasons.map((season) => (
          <option key={season}>{season}</option>
        ))}
      </select>

      {seasonStats && (
        <>
          <section className="mt-8 grid grid-cols-4 gap-5">
            <StatCard title="Saison" value={seasonStats.season} />
            <StatCard title="Champion" value={seasonStats.champion} />
            <StatCard title="Matchs" value={seasonStats.matches} />
            <StatCard title="Buts" value={seasonStats.goals} />
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-bold">Classement</h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-500">
                    <th className="py-3">#</th>
                    <th>Team</th>
                    <th>Played</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>GD</th>
                    <th>Pts</th>
                  </tr>
                </thead>

                <tbody>
                  {seasonStats.standings.map((team, index) => (
                    <tr
                      key={team.team}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-3 font-semibold">{index + 1}</td>
                      <td className="font-semibold">{team.team}</td>
                      <td>{team.played}</td>
                      <td>{team.wins}</td>
                      <td>{team.draws}</td>
                      <td>{team.losses}</td>
                      <td>{team.goals_for}</td>
                      <td>{team.goals_against}</td>
                      <td>{team.goal_diff}</td>
                      <td className="font-bold text-emerald-600">
                        {team.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-3 text-2xl font-bold">{value}</h3>
    </div>
  );
}