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
import { GitCompare, Sparkles } from "lucide-react";
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
import MetricCard from "../components/ui/MetricCard";
import PageHero from "../components/ui/PageHero";
import StatTile from "../components/ui/StatTile";
import compareHero from "../assets/backgrounds/compare-hero.webp";

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

  return (
    <motion.div
      className="min-w-0"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <PageHero
        kicker="Match intelligence"
        title="Build a premium matchup briefing"
        description="Select two clubs to generate a structured comparison with team profiles, head-to-head history, charts, and statistical prediction."
        columns="lg:grid-cols-[0.9fr_1.1fr]"
        backgroundImage={compareHero}
      >
        <motion.div
          className="hero-widget rounded-[2rem] p-4"
          variants={cardVariants}
          whileHover={cardHover}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <TeamSelect value={teamA} onChange={setTeamA} teams={teams} disabled={!!teamsError} />
            <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white md:flex">
              <GitCompare size={20} />
            </div>
            <TeamSelect value={teamB} onChange={setTeamB} teams={teams} disabled={!!teamsError} />
          </div>

          <motion.button
            onClick={handleCompare}
            className="premium-button mt-4 min-h-12 w-full rounded-2xl px-5 py-3 font-black text-white disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isComparing}
            {...buttonMotion}
          >
            {isComparing ? "Building matchup..." : "Compare teams"}
          </motion.button>
        </motion.div>
      </PageHero>

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
              <p className="mt-2 text-4xl font-black">{prediction.predicted_winner}</p>
            </div>
          </div>

          <motion.div
            className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <MetricCard
              title={`${prediction.team_a} Probability`}
              value={`${prediction.probability_team_a}%`}
            />
            <MetricCard
              title="Draw Probability"
              value={`${prediction.probability_draw}%`}
            />
            <MetricCard
              title={`${prediction.team_b} Probability`}
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
        <section className="mt-8 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          {comparison && (
            <ChartPanel title="Global Comparison">
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
            <div className="space-y-5">
              <motion.div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <MetricCard title="H2H Matches" value={h2h.matches_played} />
                <MetricCard title={`${h2h.team_a} Wins`} value={h2h.team_a_wins} />
                <MetricCard title={`${h2h.team_b} Wins`} value={h2h.team_b_wins} />
                <MetricCard title="Draws" value={h2h.draws} />
                <MetricCard title="Goals" value={`${h2h.goals_team_a} - ${h2h.goals_team_b}`} />
              </motion.div>

              <ChartPanel title="Head-to-Head Results" compact>
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
            </div>
          )}
        </section>
      )}
    </motion.div>
  );
}

function TeamSelect({ value, onChange, teams, disabled = false }) {
  return (
    <select
      className="premium-field min-h-12 min-w-0 rounded-2xl px-4 py-3 font-bold outline-none"
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
  return (
    <motion.div
      className="premium-card min-w-0 rounded-[2rem] p-5 sm:p-6"
      variants={cardVariants}
      whileHover={cardHover}
    >
      <h2 className="break-words text-3xl font-black text-slate-950">
        {data.team}
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <StatTile label="Played" value={data.played} />
        <StatTile label="Wins" value={data.wins} />
        <StatTile label="Draws" value={data.draws} />
        <StatTile label="Losses" value={data.losses} />
        <StatTile label="Goals For" value={data.goals_scored} />
        <StatTile label="Goals Against" value={data.goals_conceded} />
      </div>
    </motion.div>
  );
}
