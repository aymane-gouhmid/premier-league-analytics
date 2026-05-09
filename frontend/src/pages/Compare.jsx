import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Activity, Plus, Sparkles } from "lucide-react";
import api from "../api/footballApi";
import {
  buttonMotion,
  cardHover,
  cardVariants,
  containerVariants,
  pageVariants,
} from "../lib/motion";
import SkeletonCard from "../components/SkeletonCard";
import StateCard from "../components/StateCard";
import ChartPanel from "../components/ui/ChartPanel";
import PageHero from "../components/ui/PageHero";
import StatTile from "../components/ui/StatTile";
import compareHero from "../assets/backgrounds/compare-hero.webp";
import { teamLogos } from "../data/teamLogos";

export default function Compare() {
  const [teams, setTeams] = useState([]);
  const [teamA, setTeamA] = useState("Arsenal");
  const [teamB, setTeamB] = useState("Chelsea");
  const [comparison, setComparison] = useState(null);
  const [h2h, setH2h] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [teamsError, setTeamsError] = useState(null);
  const [compareError, setCompareError] = useState(null);

  function loadTeams() {
    setTeamsError(null);
    api
      .get("/teams")
      .then((res) => setTeams(res.data))
      .catch(() => setTeamsError("Unable to load teams for comparison."));
  }

  useEffect(() => {
    loadTeams();
  }, []);

  async function handleCompare() {
    setIsComparing(true);
    setComparison(null);
    setH2h(null);
    setPrediction(null);
    setCompareError(null);

    try {
      const [compareRes, h2hRes, predictionRes] = await Promise.all([
        api.get(`/compare?team_a=${teamA}&team_b=${teamB}`),
        api.get(`/head-to-head?team_a=${teamA}&team_b=${teamB}`),
        api.get(`/predict?team_a=${teamA}&team_b=${teamB}`),
      ]);

      setComparison(compareRes.data);
      setH2h(h2hRes.data);
      setPrediction(predictionRes.data);
    } catch {
      setCompareError("Unable to build this matchup briefing right now.");
    } finally {
      setIsComparing(false);
    }
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

  const efficiencyChartData = comparison
    ? [
        {
          stat: "Win Rate",
          [comparison.team_a.team]: getRate(comparison.team_a.wins, comparison.team_a.played),
          [comparison.team_b.team]: getRate(comparison.team_b.wins, comparison.team_b.played),
        },
        {
          stat: "Goals / Match",
          [comparison.team_a.team]: getRate(comparison.team_a.goals_scored, comparison.team_a.played),
          [comparison.team_b.team]: getRate(comparison.team_b.goals_scored, comparison.team_b.played),
        },
        {
          stat: "Conceded / Match",
          [comparison.team_a.team]: getRate(comparison.team_a.goals_conceded, comparison.team_a.played),
          [comparison.team_b.team]: getRate(comparison.team_b.goals_conceded, comparison.team_b.played),
        },
      ]
    : [];

  const predictionChartData = prediction
    ? [
        { name: prediction.team_a, probability: prediction.probability_team_a },
        { name: "Draw", probability: prediction.probability_draw },
        { name: prediction.team_b, probability: prediction.probability_team_b },
      ]
    : [];

  const h2hGoalsData = h2h
    ? [
        { name: h2h.team_a, goals: h2h.goals_team_a },
        { name: h2h.team_b, goals: h2h.goals_team_b },
      ]
    : [];

  return (
    <motion.div
      className="min-w-0"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <PageHero
        kicker="Match intelligence"
        title="Compare Teams"
        description="Head-to-head analysis and predictions with a cleaner matchup studio for choosing two Premier League clubs."
        columns="lg:grid-cols-[1fr_0.8fr]"
        backgroundImage={compareHero}
      >
        <motion.div
          className="hero-widget rounded-[2rem] p-5"
          variants={cardVariants}
          whileHover={cardHover}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Activity size={21} />
            </div>
            <div>
              <p className="section-label">Briefing engine</p>
              <p className="mt-1 text-sm font-semibold text-slate-600">
                Pick two clubs, then generate comparison, H2H and prediction.
              </p>
            </div>
          </div>
        </motion.div>
      </PageHero>

      <motion.section
        className="-mt-5 grid gap-5 px-1 lg:grid-cols-[minmax(0,1fr)_9rem_minmax(0,1fr)] lg:items-stretch lg:px-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <TeamPickerCard
          label="Select Team A"
          value={teamA}
          onChange={setTeamA}
          teams={teams}
          disabled={!!teamsError}
        />

        <motion.div
          className="premium-card flex flex-col items-center justify-center gap-3 rounded-[2rem] p-4 text-center"
          variants={cardVariants}
          whileHover={cardHover}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 text-lg font-black text-white shadow-xl shadow-slate-950/20">
            VS
          </div>
          <motion.button
            onClick={handleCompare}
            className="premium-button min-h-12 w-full rounded-2xl px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isComparing || !!teamsError}
            {...buttonMotion}
          >
            {isComparing ? "Building..." : "Compare"}
          </motion.button>
        </motion.div>

        <TeamPickerCard
          label="Select Team B"
          value={teamB}
          onChange={setTeamB}
          teams={teams}
          disabled={!!teamsError}
        />
      </motion.section>

      {teamsError && (
        <StateCard
          className="mt-8"
          title="Teams unavailable"
          message={teamsError}
          onAction={loadTeams}
          actionLabel="Reload teams"
        />
      )}

      {compareError && (
        <StateCard
          className="mt-8"
          title="Comparison failed"
          message={compareError}
          onAction={handleCompare}
          actionLabel="Retry comparison"
        />
      )}

      {isComparing && <CompareSkeleton />}

      {!teamsError && !compareError && !isComparing && !comparison && !h2h && !prediction && (
        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          <InsightPlaceholder title="Global comparison" />
          <InsightPlaceholder title="Head-to-head analytics" />
          <InsightPlaceholder title="Prediction model" />
        </section>
      )}

      {prediction && (
        <motion.section
          className="premium-card-emerald mt-8 rounded-[2rem] p-5 sm:p-7"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ ...cardHover, y: -3 }}
        >
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="section-label">Prediction model</p>
              <h2 className="section-title">AI Match Prediction</h2>
              <p className="mt-4 text-slate-600">{prediction.note}</p>
            </div>
            <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                Predicted winner
              </p>
              <div className="mt-3">
                <TeamName
                  team={prediction.predicted_winner}
                  className="text-4xl font-black text-white"
                  logoClassName="h-12 w-12 rounded-2xl bg-white/10 p-2"
                />
              </div>
            </div>
          </div>

          <motion.div
            className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <ProbabilityCard
              team={prediction.team_a}
              label="Probability"
              value={`${prediction.probability_team_a}%`}
            />
            <ProbabilityCard
              team="Draw"
              label="Probability"
              value={`${prediction.probability_draw}%`}
            />
            <ProbabilityCard
              team={prediction.team_b}
              label="Probability"
              value={`${prediction.probability_team_b}%`}
            />
          </motion.div>
        </motion.section>
      )}

      {comparison && (
        <section className="mt-8">
          <div>
            <p className="section-label">Team profiles</p>
            <h2 className="section-title">Side-by-side performance studio</h2>
          </div>

          <motion.div
            className="bento-section lg:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <TeamCard data={comparison.team_a} />
            <TeamCard data={comparison.team_b} />
          </motion.div>
        </section>
      )}

      {(comparison || h2h) && (
        <section className="mt-8 grid min-w-0 gap-5 xl:grid-cols-12">
          {h2h && (
            <motion.div
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:col-span-12 xl:grid-cols-5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <H2HStatCard label="H2H Matches" value={h2h.matches_played} />
              <H2HStatCard team={h2h.team_a} label="Wins" value={h2h.team_a_wins} />
              <H2HStatCard team={h2h.team_b} label="Wins" value={h2h.team_b_wins} />
              <H2HStatCard label="Draws" value={h2h.draws} />
              <H2HStatCard
                label="Goals"
                value={`${h2h.goals_team_a} - ${h2h.goals_team_b}`}
                team={h2h.team_a}
                secondTeam={h2h.team_b}
              />
            </motion.div>
          )}

          {comparison && (
            <ChartPanel
              className="xl:col-span-7"
              title="Global Comparison"
              heightClass="h-[24rem] sm:h-[30rem]"
            >
              <BarChart
                data={chartData}
                margin={{ top: 18, right: 32, left: 8, bottom: 18 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#dbe7e2" />
                <XAxis
                  dataKey="stat"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  padding={{ left: 20, right: 20 }}
                />
                <YAxis width={42} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey={comparison.team_a.team} fill="#059669" radius={[10, 10, 0, 0]} />
                <Bar dataKey={comparison.team_b.team} fill="#14b8a6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ChartPanel>
          )}

          {h2h && (
            <ChartPanel
              className="xl:col-span-5"
              title="Head-to-Head Results"
              heightClass="h-[24rem] sm:h-[30rem]"
            >
              <BarChart
                data={h2hChartData}
                margin={{ top: 18, right: 28, left: 8, bottom: 18 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#dbe7e2" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  padding={{ left: 18, right: 18 }}
                />
                <YAxis width={38} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ChartPanel>
          )}

          {comparison && (
            <ChartPanel className="xl:col-span-4" title="Efficiency Index" badge="Per match" compact>
              <BarChart
                data={efficiencyChartData}
                margin={{ top: 18, right: 24, left: 0, bottom: 18 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#dbe7e2" />
                <XAxis dataKey="stat" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis width={34} tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey={comparison.team_a.team} fill="#0f766e" radius={[8, 8, 0, 0]} />
                <Bar dataKey={comparison.team_b.team} fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartPanel>
          )}

          {prediction && (
            <ChartPanel className="xl:col-span-4" title="Prediction Probability" badge="Model" compact>
              <BarChart
                data={predictionChartData}
                margin={{ top: 18, right: 24, left: 0, bottom: 18 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#dbe7e2" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis width={34} tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="probability" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartPanel>
          )}

          {h2h && (
            <ChartPanel className="xl:col-span-4" title="H2H Goals Split" badge="Goals" compact>
              <BarChart
                data={h2hGoalsData}
                margin={{ top: 18, right: 28, left: 8, bottom: 18 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#dbe7e2" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  padding={{ left: 18, right: 18 }}
                />
                <YAxis width={38} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="goals" fill="#14b8a6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ChartPanel>
          )}

          {h2h?.recent_matches?.length ? (
            <RecentH2HMatches
              className="xl:col-span-12"
              matches={h2h.recent_matches}
              teamA={h2h.team_a}
              teamB={h2h.team_b}
            />
          ) : null}
        </section>
      )}
    </motion.div>
  );
}

function getRate(value, total) {
  if (!total) return 0;
  return Number((value / total).toFixed(2));
}

function TeamName({ team, className = "text-xl font-black text-slate-950", logoClassName = "h-10 w-10 rounded-2xl bg-white/80 p-2" }) {
  const logo = teamLogos[team];

  if (team === "Draw") {
    return (
      <span className={`inline-flex min-w-0 items-center gap-3 ${className}`}>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-sm font-black text-slate-500">
          D
        </span>
        <span className="min-w-0 truncate">Draw</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex min-w-0 items-center gap-3 ${className}`}>
      {logo ? (
        <img src={logo} alt={team} className={`shrink-0 object-contain ${logoClassName}`} />
      ) : null}
      <span className="min-w-0 truncate">{team}</span>
    </span>
  );
}

function ProbabilityCard({ team, label, value }) {
  return (
    <motion.div
      className="premium-card min-w-0 rounded-[1.5rem] p-5"
      variants={cardVariants}
      whileHover={{ y: -3 }}
    >
      <TeamName team={team} className="text-base font-black text-slate-950" />
      <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </motion.div>
  );
}

function H2HStatCard({ team, secondTeam, label, value }) {
  return (
    <motion.div
      className="premium-card min-w-0 rounded-[1.5rem] p-5"
      variants={cardVariants}
      whileHover={{ y: -3 }}
    >
      {team ? (
        <div className="flex items-center justify-between gap-3">
          <TeamName team={team} className="text-sm font-black text-slate-950" />
          {secondTeam ? (
            <TeamName
              team={secondTeam}
              className="text-sm font-black text-slate-950"
              logoClassName="h-8 w-8 rounded-xl bg-white/80 p-1.5"
            />
          ) : null}
        </div>
      ) : null}
      <p className={`${team ? "mt-4" : ""} text-xs font-black uppercase tracking-[0.14em] text-slate-500`}>
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </motion.div>
  );
}

function RecentH2HMatches({ matches, teamA, teamB, className = "" }) {
  return (
    <motion.section
      className={`premium-card rounded-[2rem] p-5 ${className}`}
      variants={cardVariants}
      whileHover={cardHover}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="section-label">Recent H2H</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Latest meetings</h2>
        </div>
        <div className="flex -space-x-2">
          {[teamA, teamB].map((team) => (
            <img
              key={team}
              src={teamLogos[team]}
              alt={team}
              className="h-10 w-10 rounded-2xl bg-white p-2 ring-2 ring-white"
            />
          ))}
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {matches.slice(0, 5).map((match, index) => (
          <div key={index} className="premium-surface flex min-h-36 flex-col justify-between rounded-2xl p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
              {match.Date} - {match.Season}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-black text-slate-950">
              <TeamName team={match.HomeTeam} className="text-sm font-black text-slate-950" logoClassName="h-8 w-8 rounded-xl bg-white/80 p-1.5" />
              <span>{match.FTHG} - {match.FTAG}</span>
              <TeamName team={match.AwayTeam} className="text-sm font-black text-slate-950" logoClassName="h-8 w-8 rounded-xl bg-white/80 p-1.5" />
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function TeamPickerCard({ label, value, onChange, teams, disabled = false }) {
  const logo = teamLogos[value];

  return (
    <motion.div
      className="premium-card group relative flex min-h-64 flex-col items-center justify-center overflow-hidden rounded-[2rem] p-5 text-center"
      variants={cardVariants}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-emerald-300/16 blur-3xl transition-opacity group-hover:opacity-100" />
      <div className="pointer-events-none absolute -bottom-24 left-12 h-52 w-52 rounded-full bg-teal-300/12 blur-3xl" />

      <div className="relative flex flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400 shadow-inner">
          {logo ? (
            <img src={logo} alt={value} className="h-14 w-14 object-contain" />
          ) : (
            <Plus size={34} strokeWidth={2.2} />
          )}
        </div>
        <p className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-emerald-700">
          {label}
        </p>
        <h2 className="mt-2 max-w-full truncate text-3xl font-black text-slate-950">
          {value || "Choose club"}
        </h2>
      </div>

      <TeamSelect
        value={value}
        onChange={onChange}
        teams={teams}
        disabled={disabled}
      />
    </motion.div>
  );
}

function TeamSelect({ value, onChange, teams, disabled = false }) {
  return (
    <select
      className="premium-field relative mt-6 min-h-12 w-full max-w-sm rounded-2xl px-4 py-3 text-center font-bold outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      {teams.map((team) => (
        <option key={team}>{team}</option>
      ))}
    </select>
  );
}

function InsightPlaceholder({ title }) {
  return (
    <div className="premium-card rounded-[2rem] p-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
        <Sparkles size={20} />
      </div>
      <h3 className="mt-5 text-xl font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Run a comparison to populate this analytics panel.
      </p>
    </div>
  );
}

function CompareSkeleton() {
  return (
    <div className="mt-8 space-y-5">
      <SkeletonCard variant="matches" rows={3} />
      <div className="grid gap-5 lg:grid-cols-2">
        <TeamComparisonSkeleton />
        <TeamComparisonSkeleton />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <SkeletonCard variant="chart" />
        <SkeletonCard variant="chart" />
      </div>
    </div>
  );
}

function TeamComparisonSkeleton() {
  return (
    <div className="premium-card min-w-0 rounded-3xl p-4 sm:p-6">
      <div className="h-6 w-36 animate-pulse rounded-full bg-emerald-100" />
      <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 md:grid-cols-3 md:gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} variant="tile" />
        ))}
      </div>
    </div>
  );
}

function TeamCard({ data }) {
  const goalDiff = data.goals_scored - data.goals_conceded;
  const winRate = data.played ? Math.round((data.wins / data.played) * 100) : 0;
  const goalsPerMatch = data.played ? (data.goals_scored / data.played).toFixed(2) : "0.00";

  return (
    <motion.div
      className="premium-card min-w-0 rounded-[2rem] p-5 sm:p-6"
      variants={cardVariants}
      whileHover={cardHover}
    >
      <TeamName
        team={data.team}
        className="text-3xl font-black text-slate-950"
        logoClassName="h-14 w-14 rounded-2xl bg-white/80 p-2"
      />

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <StatTile label="Played" value={data.played} />
        <StatTile label="Wins" value={data.wins} />
        <StatTile label="Draws" value={data.draws} />
        <StatTile label="Losses" value={data.losses} />
        <StatTile label="Goals For" value={data.goals_scored} />
        <StatTile label="Goals Against" value={data.goals_conceded} />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile label="Win Rate" value={`${winRate}%`} />
        <StatTile label="Goal Diff" value={goalDiff} />
        <StatTile label="Goals / Match" value={goalsPerMatch} />
      </div>
    </motion.div>
  );
}
