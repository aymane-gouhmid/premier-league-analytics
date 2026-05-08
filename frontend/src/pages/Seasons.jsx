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
    <div className="min-w-0">
      <h1 className="text-3xl font-bold sm:text-4xl">Seasons</h1>
      <p className="mt-2 text-slate-500">
        Explore les statistiques de chaque saison Premier League.
      </p>

      <select
        className="mt-6 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 sm:w-auto"
        value={selectedSeason}
        onChange={(e) => setSelectedSeason(e.target.value)}
      >
        {seasons.map((season) => (
          <option key={season}>{season}</option>
        ))}
      </select>

      {seasonStats && (
        <>
          <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-8 lg:grid-cols-4 lg:gap-5">
            <StatCard title="Saison" value={seasonStats.season} />
            <StatCard title="Champion" value={seasonStats.champion} />
            <StatCard title="Matchs" value={seasonStats.matches} />
            <StatCard title="Buts" value={seasonStats.goals} />
          </section>

          <section className="mt-6 min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:mt-8">
            <h2 className="mb-4 text-xl font-bold sm:mb-5 sm:text-2xl">Classement</h2>

            <div className="-mx-4 overflow-x-auto sm:mx-0">
              <table className="min-w-[760px] border-collapse text-left text-sm sm:w-full">
                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-500">
                    <th className="px-4 py-3 sm:px-0">#</th>
                    <th className="px-3 sm:px-0">Team</th>
                    <th className="px-3 sm:px-0">Played</th>
                    <th className="px-3 sm:px-0">W</th>
                    <th className="px-3 sm:px-0">D</th>
                    <th className="px-3 sm:px-0">L</th>
                    <th className="px-3 sm:px-0">GF</th>
                    <th className="px-3 sm:px-0">GA</th>
                    <th className="px-3 sm:px-0">GD</th>
                    <th className="px-3 sm:px-0">Pts</th>
                  </tr>
                </thead>

                <tbody>
                  {seasonStats.standings.map((team, index) => (
                    <tr
                      key={team.team}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 font-semibold sm:px-0">{index + 1}</td>
                      <td className="px-3 font-semibold sm:px-0">{team.team}</td>
                      <td className="px-3 sm:px-0">{team.played}</td>
                      <td className="px-3 sm:px-0">{team.wins}</td>
                      <td className="px-3 sm:px-0">{team.draws}</td>
                      <td className="px-3 sm:px-0">{team.losses}</td>
                      <td className="px-3 sm:px-0">{team.goals_for}</td>
                      <td className="px-3 sm:px-0">{team.goals_against}</td>
                      <td className="px-3 sm:px-0">{team.goal_diff}</td>
                      <td className="px-3 font-bold text-emerald-600 sm:px-0">
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
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-2 break-words text-xl font-bold sm:mt-3 sm:text-2xl">{value}</h3>
    </div>
  );
}
