import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Shield } from "lucide-react";
import api from "../api/footballApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import SkeletonCard from "../components/SkeletonCard";
import StateCard from "../components/StateCard";
import ChartPanel from "../components/ui/ChartPanel";
import PageHero from "../components/ui/PageHero";
import StatTile from "../components/ui/StatTile";
import { teamLogos } from "../data/teamLogos";
import teamsHero from "../assets/backgrounds/teams-hero.webp";
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
  const [teamsError, setTeamsError] = useState(null);
  const [selectedTeamError, setSelectedTeamError] = useState(null);
  const [pendingTeam, setPendingTeam] = useState(null);

  function loadTeams() {
    setIsTeamsLoading(true);
    setTeamsError(null);

    api
      .get("/teams")
      .then((res) => setTeams(res.data))
      .catch(() => setTeamsError("Unable to load the club directory."))
      .finally(() => setIsTeamsLoading(false));
  }

  useEffect(() => {
    loadTeams();
  }, []);

  async function handleSelectTeam(team) {
    setIsSelectedTeamLoading(true);
    setSelectedTeamError(null);
    setPendingTeam(team);

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
      setPendingTeam(null);
    } catch {
      setSelectedTeamError(`Unable to load ${team} details.`);
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
      <PageHero
        kicker="Club performance lab"
        title="Explore the league club by club"
        description="Pick a team to open a focused intelligence panel with historical stats, points evolution, logos, and last-match form."
        columns="lg:grid-cols-[1fr_0.9fr]"
        backgroundImage={teamsHero}
      >
        <div className="hero-widget rounded-3xl p-3 sm:p-4">
          <label className="flex items-center gap-3 rounded-2xl bg-white/72 px-4 py-3">
            <Search className="text-emerald-700" size={20} />
            <input
              className="min-h-10 w-full bg-transparent font-bold text-slate-900 outline-none placeholder:text-slate-400"
              placeholder="Search team..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>
      </PageHero>

      <section className="mt-8 grid gap-5 lg:grid-cols-[20rem_minmax(0,1fr)] xl:grid-cols-[22rem_minmax(0,1fr)] lg:items-start">
        <motion.aside
          className="premium-card rounded-[2rem] p-4 lg:sticky lg:top-28"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="section-label">Club directory</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                {isTeamsLoading ? "Loading" : `${filteredTeams.length} clubs`}
              </h2>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Shield size={20} />
            </div>
          </div>

          <motion.div
            className="mt-5 grid max-h-[30rem] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {isTeamsLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <SkeletonCard key={index} variant="team" />
              ))
            ) : teamsError ? (
              <StateCard
                className="sm:col-span-2 lg:col-span-1"
                title="Clubs unavailable"
                message={teamsError}
                onAction={loadTeams}
                actionLabel="Reload clubs"
              />
            ) : filteredTeams.length ? (
              filteredTeams.map((team) => (
                <TeamButton
                  key={team}
                  team={team}
                  isActive={selectedTeam?.team === team}
                  onClick={() => handleSelectTeam(team)}
                />
              ))
            ) : (
              <StateCard
                type="empty"
                className="sm:col-span-2 lg:col-span-1"
                title="No clubs found"
                message="Try a different team name or clear the search field."
              />
            )}
          </motion.div>
        </motion.aside>

        <div className="min-w-0">
          {isSelectedTeamLoading && <SelectedTeamSkeleton />}

          {!isSelectedTeamLoading && selectedTeamError && (
            <StateCard
              title="Team details unavailable"
              message={selectedTeamError}
              onAction={() => pendingTeam && handleSelectTeam(pendingTeam)}
              actionLabel="Retry team"
            />
          )}

          {!isSelectedTeamLoading && !selectedTeam && !selectedTeamError && (
            <div className="premium-card-emerald rounded-[2rem] p-6 sm:p-8">
              <p className="section-label">Awaiting selection</p>
              <h2 className="section-title">Choose a club to open the analysis studio</h2>
              <p className="mt-4 max-w-2xl text-slate-600">
                The selected team view will expand into performance cards, a
                points timeline, and recent match form without leaving this page.
              </p>
            </div>
          )}

          {!isSelectedTeamLoading && selectedTeam && !selectedTeamError && (
            <TeamStudio selectedTeam={selectedTeam} />
          )}
        </div>
      </section>
    </motion.div>
  );
}

function TeamButton({ team, isActive, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-3xl p-4 text-left font-black transition-colors ${
        isActive
          ? "bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
          : "bg-white/62 text-slate-800 hover:text-emerald-700"
      }`}
      variants={cardVariants}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={buttonMotion.whileTap}
      transition={buttonMotion.transition}
    >
      <img src={teamLogos[team]} alt={team} className="h-9 w-9 object-contain" />
      <span className="min-w-0 truncate">{team}</span>
    </motion.button>
  );
}

function TeamStudio({ selectedTeam }) {
  return (
    <motion.div
      className="space-y-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        className="premium-card-emerald overflow-hidden rounded-[2rem] p-5 sm:p-7"
        variants={cardVariants}
        whileHover={cardHover}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="logo-halo flex h-20 w-20 items-center justify-center rounded-3xl bg-white/76 p-3 shadow-sm">
              <img
                src={teamLogos[selectedTeam.team]}
                alt={selectedTeam.team}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="section-label">Team studio</p>
              <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">
                {selectedTeam.team}
              </h2>
            </div>
          </div>
          <div className="rounded-3xl bg-slate-950 px-5 py-3 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
              Played
            </p>
            <p className="mt-1 text-3xl font-black">{selectedTeam.played}</p>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5"
        variants={containerVariants}
      >
        <StatTile surface={false} label="Wins" value={selectedTeam.wins} />
        <StatTile surface={false} label="Draws" value={selectedTeam.draws} />
        <StatTile surface={false} label="Losses" value={selectedTeam.losses} />
        <StatTile surface={false} label="Goals For" value={selectedTeam.goals_scored} />
        <StatTile surface={false} label="Goals Against" value={selectedTeam.goals_conceded} />
      </motion.section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem] 2xl:grid-cols-[minmax(0,1fr)_27rem]">
        <ChartPanel
          title="Points Evolution"
          heightClass="h-[24rem] sm:h-[28rem] xl:h-[32rem]"
        >
          <LineChart
            data={selectedTeam.history}
            margin={{ top: 18, right: 36, left: 12, bottom: 22 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#dbe7e2" />
            <XAxis
              dataKey="season"
              interval="preserveStartEnd"
              minTickGap={22}
              tick={{ fill: "#64748b", fontSize: 12 }}
              padding={{ left: 24, right: 24 }}
            />
            <YAxis width={42} tick={{ fill: "#64748b", fontSize: 12 }} />
            <Tooltip />
            <Line dataKey="points" stroke="#059669" strokeWidth={3} dot={false} />
          </LineChart>
        </ChartPanel>

        <motion.section
          className="premium-card rounded-[2rem] p-4 sm:p-6"
          variants={cardVariants}
          whileHover={cardHover}
        >
          <h2 className="mb-5 text-2xl font-black">Last 10 Matches</h2>
          <div className="space-y-3">
            {selectedTeam.lastMatches.map((match, index) => (
              <motion.div
                key={index}
                className="premium-surface flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between"
                whileHover={{ y: -2, backgroundColor: "#f8fafc" }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    {match.date} - {match.season} - {match.venue}
                  </p>
                  <p className="mt-1 font-bold">
                    {match.home_team} {match.home_goals} - {match.away_goals}{" "}
                    {match.away_team}
                  </p>
                </div>
                <span
                  className={`w-fit rounded-full px-3 py-1 text-sm font-black ${
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
        </motion.section>
      </div>
    </motion.div>
  );
}

function SelectedTeamSkeleton() {
  return (
    <div className="space-y-5">
      <motion.section
        className="premium-card mt-0 grid grid-cols-1 gap-3 rounded-3xl p-4 sm:p-6 lg:grid-cols-5 lg:gap-4"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-3 lg:col-span-5">
          <div className="h-16 w-16 animate-pulse rounded-3xl bg-emerald-100" />
          <div className="h-7 w-48 animate-pulse rounded-full bg-slate-200" />
        </div>
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonCard key={index} variant="tile" />
        ))}
      </motion.section>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem] 2xl:grid-cols-[minmax(0,1fr)_27rem]">
        <SkeletonCard variant="chart" />
        <SkeletonCard variant="matches" rows={4} />
      </div>
    </div>
  );
}
