import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
import SkeletonCard from "../components/SkeletonCard";
import { teamLogos } from "../data/teamLogos";
import {
  buttonMotion,
  cardHover,
  cardVariants,
  containerVariants,
  pageVariants,
} from "../lib/motion";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isTeamsLoading, setIsTeamsLoading] = useState(true);
  const [isSelectedTeamLoading, setIsSelectedTeamLoading] = useState(false);

  useEffect(() => {
    api
      .get("/teams")
      .then((res) => setTeams(res.data))
      .finally(() => setIsTeamsLoading(false));
  }, []);

  async function handleSelectTeam(team) {
    setIsSelectedTeamLoading(true);

    try {
      const [statsRes, historyRes, lastMatchesRes] = await Promise.all([
        api.get(`/teams/${team}`),
        api.get(`/teams/${team}/history`),
        api.get(`/teams/${team}/last-matches?limit=10`),
      ]);

      setSelectedTeam({
        ...statsRes.data,
        history: historyRes.data,
        lastMatches: lastMatchesRes.data,
      });
    } finally {
      setIsSelectedTeamLoading(false);
    }
  }

  const filteredTeams = teams.filter((team) =>
    team.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className="min-w-0"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-3xl font-bold sm:text-4xl">Teams</h1>
      <p className="mt-2 text-slate-500">
        Explore les statistiques de chaque equipe.
      </p>

      <input
        className="mt-6 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500"
        placeholder="Search team..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isSelectedTeamLoading && <SelectedTeamSkeleton />}

      {!isSelectedTeamLoading && selectedTeam && (
        <>
          <motion.div
            className="mt-6 min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={cardHover}
          >
            <div className="flex items-center gap-3">
              <img
                src={teamLogos[selectedTeam.team]}
                alt={selectedTeam.team}
                className="h-12 w-12 object-contain"
              />
              <h2 className="break-words text-xl font-bold text-emerald-600 sm:text-2xl">
                {selectedTeam.team}
              </h2>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
              <Stat label="Played" value={selectedTeam.played} />
              <Stat label="Wins" value={selectedTeam.wins} />
              <Stat label="Draws" value={selectedTeam.draws} />
              <Stat label="Losses" value={selectedTeam.losses} />
              <Stat label="Goals For" value={selectedTeam.goals_scored} />
              <Stat label="Goals Against" value={selectedTeam.goals_conceded} />
            </div>
          </motion.div>

          <motion.div
            className="mt-6 min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={cardHover}
          >
            <h2 className="mb-4 text-xl font-bold sm:mb-6 sm:text-2xl">
              Points Evolution
            </h2>

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
          </motion.div>

          <motion.div
            className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={cardHover}
          >
            <h2 className="mb-4 text-xl font-bold sm:text-2xl">
              Last 10 Matches
            </h2>

            <div className="space-y-3">
              {selectedTeam.lastMatches.map((match, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  whileHover={{ y: -2, backgroundColor: "#f8fafc" }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <div>
                    <p className="text-sm text-slate-500">
                      {match.date} - {match.season} - {match.venue}
                    </p>
                    <p className="mt-1 font-semibold">
                      {match.home_team} {match.home_goals} - {match.away_goals}{" "}
                      {match.away_team}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-sm font-bold ${
                      match.result === "W"
                        ? "bg-emerald-100 text-emerald-700"
                        : match.result === "D"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {match.result}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}

      <motion.div
        className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-8 lg:grid-cols-4 lg:gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {isTeamsLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <SkeletonCard key={index} variant="team" />
            ))
          : filteredTeams.map((team) => (
              <motion.button
                key={team}
                onClick={() => handleSelectTeam(team)}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-left font-semibold shadow-sm hover:border-emerald-500 hover:text-emerald-600"
                variants={cardVariants}
                whileHover={{
                  y: -4,
                  scale: 1.01,
                  borderColor: "#10b981",
                  boxShadow: "0 18px 38px -24px rgba(15, 23, 42, 0.45)",
                }}
                whileTap={buttonMotion.whileTap}
                transition={buttonMotion.transition}
              >
                <img
                  src={teamLogos[team]}
                  alt={team}
                  className="h-8 w-8 object-contain"
                />
                <span>{team}</span>
              </motion.button>
            ))}
      </motion.div>
    </motion.div>
  );
}

function SelectedTeamSkeleton() {
  return (
    <>
      <motion.section
        className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-6 lg:gap-4"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-3 lg:col-span-6">
          <div className="h-12 w-12 animate-pulse rounded-full bg-emerald-100" />
          <div className="h-6 w-44 animate-pulse rounded-full bg-slate-200" />
        </div>
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} variant="tile" />
        ))}
      </motion.section>
      <SkeletonCard variant="chart" className="mt-6" />
      <SkeletonCard variant="matches" rows={4} className="mt-6" />
    </>
  );
}

function Stat({ label, value }) {
  return (
    <motion.div
      className="min-w-0 rounded-xl bg-slate-50 p-3 sm:p-4"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <p className="text-sm text-slate-500">{label}</p>
      <h3 className="mt-2 break-words text-xl font-bold sm:text-2xl">
        {value}
      </h3>
    </motion.div>
  );
}
