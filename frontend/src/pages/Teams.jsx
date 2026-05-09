import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Shield } from "lucide-react";
import api from "../api/footballApi";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
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

      <section className="mt-8 space-y-5">
        <div className="grid gap-5 lg:grid-cols-[21rem_minmax(0,1fr)] xl:grid-cols-[23rem_minmax(0,1fr)] lg:items-start">
          <motion.aside
            className="premium-card flex max-h-[34rem] min-h-[34rem] flex-col rounded-[2rem] p-4 lg:sticky lg:top-28 xl:max-h-[36rem] xl:min-h-[36rem]"
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
              className="mt-5 grid flex-1 grid-cols-1 content-start gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {isTeamsLoading ? (
                Array.from({ length: 8 }).map((_, index) => (
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
            {isSelectedTeamLoading && <SelectedTeamOverviewSkeleton />}

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
                  The selected team view will expand into performance cards,
                  five recent matches, and full-width analytics charts below.
                </p>
              </div>
            )}

            {!isSelectedTeamLoading && selectedTeam && !selectedTeamError && (
              <TeamOverview selectedTeam={selectedTeam} />
            )}
          </div>
        </div>

        {isSelectedTeamLoading && <SelectedTeamGraphsSkeleton />}

        {!isSelectedTeamLoading && selectedTeam && !selectedTeamError && (
          <TeamGraphs selectedTeam={selectedTeam} />
        )}
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

function TeamOverview({ selectedTeam }) {
  const lastFiveMatches = (selectedTeam.lastMatches || []).slice(0, 5);
  const teamMetrics = [
    { label: "Wins", value: selectedTeam.wins, tone: "emerald" },
    { label: "Draws", value: selectedTeam.draws, tone: "amber" },
    { label: "Losses", value: selectedTeam.losses, tone: "rose" },
    { label: "Goals For", value: selectedTeam.goals_scored, tone: "teal" },
    { label: "Goals Against", value: selectedTeam.goals_conceded, tone: "slate" },
  ];

  return (
    <motion.div
      className="premium-card-emerald relative overflow-hidden rounded-[2rem] p-5 sm:p-7"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={cardHover}
    >
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-20 h-64 w-64 rounded-full bg-teal-300/16 blur-3xl" />

      <div className="relative grid gap-5">
        <div className="premium-surface rounded-[1.75rem] p-4 sm:p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div className="logo-halo flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-white/82 p-3 shadow-sm sm:h-24 sm:w-24">
                <img src={teamLogos[selectedTeam.team]} alt={selectedTeam.team} className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0">
                <p className="section-label">Team studio</p>
                <h2 className="mt-1 truncate text-4xl font-black leading-none text-slate-950 sm:text-5xl">
                  {selectedTeam.team}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                    Club profile
                  </span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
                    2000-2026
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-[8rem_8rem]">
              <div className="rounded-[1.5rem] bg-slate-950 p-4 text-white shadow-xl shadow-slate-950/15">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Played</p>
                <p className="mt-2 text-4xl font-black leading-none">{selectedTeam.played}</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/82 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Win Rate</p>
                <p className="mt-2 text-4xl font-black leading-none text-slate-950">
                  {selectedTeam.played ? Math.round((selectedTeam.wins / selectedTeam.played) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>

          <motion.div
            className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
            variants={containerVariants}
          >
            {teamMetrics.map((metric) => (
              <TeamMetric key={metric.label} {...metric} />
            ))}
          </motion.div>
        </div>

        <div className="premium-card rounded-[1.75rem] p-4 sm:p-5">
          <div className="grid gap-4 xl:grid-cols-[16rem_minmax(0,1fr)] xl:items-stretch">
            <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white shadow-xl shadow-slate-950/10">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                Recent form
              </p>
              <h3 className="mt-3 text-3xl font-black leading-none">
                Last 5
              </h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {lastFiveMatches.map((match, index) => (
                  <span
                    key={`${match.date}-${index}`}
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-black ${
                      match.result === "W"
                        ? "bg-emerald-300 text-emerald-950"
                        : match.result === "D"
                        ? "bg-amber-300 text-amber-950"
                        : "bg-red-300 text-red-950"
                    }`}
                  >
                    {match.result}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-sm font-semibold leading-relaxed text-slate-300">
                Latest fixtures shown as compact match strips for quicker scanning.
              </p>
            </div>

            <div className="grid gap-3">
            {lastFiveMatches.map((match, index) => (
              <MatchRow key={index} match={match} />
            ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TeamMetric({ label, value, tone }) {
  const tones = {
    emerald: "from-emerald-50 to-white text-emerald-700 ring-emerald-200/70",
    amber: "from-amber-50 to-white text-amber-700 ring-amber-200/70",
    rose: "from-rose-50 to-white text-rose-700 ring-rose-200/70",
    teal: "from-teal-50 to-white text-teal-700 ring-teal-200/70",
    slate: "from-slate-50 to-white text-slate-700 ring-slate-200/80",
  };

  return (
    <motion.div
      className={`min-w-0 rounded-[1.35rem] bg-gradient-to-br p-4 ring-1 ${tones[tone]}`}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <p className="text-[0.7rem] font-black uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black leading-none text-slate-950">
        {value}
      </p>
    </motion.div>
  );
}

function MatchRow({ match }) {
  return (
    <motion.div
      className="premium-surface grid gap-3 rounded-2xl p-4 sm:grid-cols-[7rem_minmax(0,1fr)_2.5rem] sm:items-center"
      whileHover={{ y: -2, backgroundColor: "#f8fafc" }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <div>
        <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
          {match.date}
        </p>
        <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-emerald-700">
          {match.venue}
        </p>
      </div>
      <div className="min-w-0">
        <p className="truncate text-base font-black leading-snug text-slate-950">
          {match.home_team} {match.home_goals} - {match.away_goals}{" "}
          {match.away_team}
        </p>
        <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
          {match.season}
        </p>
      </div>
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-black ${
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
  );
}

function TeamGraphs({ selectedTeam }) {
  const history = selectedTeam.history || [];
  const goalTrend = history.map((item) => ({
    season: item.season,
    goals_for: item.goals_for,
    goals_against: item.goals_against,
  }));
  const resultTrend = history.map((item) => ({
    season: item.season,
    wins: item.wins,
    draws: item.draws,
    losses: item.losses,
  }));

  return (
    <motion.section
      className="grid min-w-0 gap-5 xl:grid-cols-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <ChartPanel
        className="xl:col-span-2"
        title="Points Evolution"
        badge="Momentum"
        heightClass="h-[22rem] sm:h-[28rem] xl:h-[30rem]"
      >
        <AreaChart
          data={history}
          margin={{ top: 18, right: 28, left: 4, bottom: 18 }}
        >
          <defs>
            <linearGradient id="pointsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.32} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#dbe7e2" />
          <XAxis
            dataKey="season"
            interval="preserveStartEnd"
            minTickGap={24}
            tick={{ fill: "#64748b", fontSize: 12 }}
            padding={{ left: 18, right: 18 }}
          />
          <YAxis width={38} tick={{ fill: "#64748b", fontSize: 12 }} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="points"
            stroke="#059669"
            fill="url(#pointsGradient)"
            strokeWidth={3}
            dot={false}
          />
        </AreaChart>
      </ChartPanel>

      <ChartPanel
        title="Goal Flow"
        badge="Attack vs Defense"
        heightClass="h-[20rem] sm:h-[24rem]"
      >
        <LineChart
          data={goalTrend}
          margin={{ top: 18, right: 20, left: 0, bottom: 18 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#dbe7e2" />
          <XAxis
            dataKey="season"
            interval="preserveStartEnd"
            minTickGap={18}
            tick={{ fill: "#64748b", fontSize: 11 }}
          />
          <YAxis width={34} tick={{ fill: "#64748b", fontSize: 11 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="goals_for"
            name="Goals For"
            stroke="#10b981"
            strokeWidth={3}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="goals_against"
            name="Goals Against"
            stroke="#f43f5e"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ChartPanel>

      <ChartPanel
        title="Season Results"
        badge="W / D / L"
        heightClass="h-[20rem] sm:h-[24rem]"
      >
        <BarChart
          data={resultTrend}
          margin={{ top: 18, right: 20, left: 0, bottom: 18 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#dbe7e2" />
          <XAxis
            dataKey="season"
            interval="preserveStartEnd"
            minTickGap={18}
            tick={{ fill: "#64748b", fontSize: 11 }}
          />
          <YAxis width={34} tick={{ fill: "#64748b", fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="wins" name="Wins" stackId="results" fill="#10b981" radius={[8, 8, 0, 0]} />
          <Bar dataKey="draws" name="Draws" stackId="results" fill="#f59e0b" />
          <Bar dataKey="losses" name="Losses" stackId="results" fill="#f43f5e" />
        </BarChart>
      </ChartPanel>
    </motion.section>
  );
}

function SelectedTeamOverviewSkeleton() {
  return (
    <motion.section
      className="premium-card mt-0 grid grid-cols-1 gap-4 rounded-3xl p-4 sm:p-6 xl:grid-cols-[minmax(0,1fr)_24rem]"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 animate-pulse rounded-3xl bg-emerald-100" />
          <div className="h-7 w-48 animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={index} variant="tile" />
          ))}
        </div>
      </div>
      <SkeletonCard variant="matches" rows={5} />
    </motion.section>
  );
}

function SelectedTeamGraphsSkeleton() {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <SkeletonCard variant="chart" className="xl:col-span-2" />
      <SkeletonCard variant="chart" />
      <SkeletonCard variant="chart" />
    </div>
  );
}
