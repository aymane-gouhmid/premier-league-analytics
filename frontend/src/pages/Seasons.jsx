import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/footballApi";
import SkeletonCard from "../components/SkeletonCard";
import {
  cardHover,
  cardVariants,
  containerVariants,
  pageVariants,
} from "../lib/motion";

export default function Seasons() {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [seasonStats, setSeasonStats] = useState(null);
  const [isSeasonsLoading, setIsSeasonsLoading] = useState(true);
  const [isSeasonStatsLoading, setIsSeasonStatsLoading] = useState(false);

  useEffect(() => {
    api
      .get("/seasons")
      .then((res) => {
        setSeasons(res.data);
        setSelectedSeason(res.data[res.data.length - 1]);
      })
      .finally(() => setIsSeasonsLoading(false));
  }, []);

  useEffect(() => {
    if (selectedSeason) {
      setIsSeasonStatsLoading(true);
      api
        .get(`/seasons/${selectedSeason}`)
        .then((res) => {
          setSeasonStats(res.data);
        })
        .finally(() => setIsSeasonStatsLoading(false));
    }
  }, [selectedSeason]);

  return (
    <motion.div
      className="min-w-0"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-3xl font-bold sm:text-4xl">Seasons</h1>
      <p className="mt-2 text-slate-500">
        Explore les statistiques de chaque saison Premier League.
      </p>

      <select
        className="mt-6 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 sm:w-auto"
        value={selectedSeason}
        onChange={(e) => setSelectedSeason(e.target.value)}
        disabled={isSeasonsLoading}
      >
        {seasons.map((season) => (
          <option key={season}>{season}</option>
        ))}
      </select>

      {(isSeasonStatsLoading || !seasonStats) && <SeasonsSkeleton />}

      {!isSeasonStatsLoading && seasonStats && (
        <>
          <motion.section
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-8 lg:grid-cols-4 lg:gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <StatCard title="Saison" value={seasonStats.season} />
            <StatCard title="Champion" value={seasonStats.champion} />
            <StatCard title="Matchs" value={seasonStats.matches} />
            <StatCard title="Buts" value={seasonStats.goals} />
          </motion.section>

          <motion.section
            className="mt-6 min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:mt-8"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={cardHover}
          >
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
                    <motion.tr
                      key={team.team}
                      className="border-b border-slate-100 hover:bg-slate-50"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.22,
                        delay: Math.min(index * 0.015, 0.25),
                        ease: "easeOut",
                      }}
                      whileHover={{ backgroundColor: "#f8fafc" }}
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
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>
        </>
      )}
    </motion.div>
  );
}

function SeasonsSkeleton() {
  return (
    <>
      <motion.section
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-8 lg:grid-cols-4 lg:gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </motion.section>

      <div className="-mx-4 mt-6 overflow-x-auto sm:mx-0 lg:mt-8">
        <SkeletonCard variant="table" rows={10} />
      </div>
    </>
  );
}

function StatCard({ title, value }) {
  return (
    <motion.div
      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      variants={cardVariants}
      whileHover={cardHover}
    >
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-2 break-words text-xl font-bold sm:mt-3 sm:text-2xl">{value}</h3>
    </motion.div>
  );
}
