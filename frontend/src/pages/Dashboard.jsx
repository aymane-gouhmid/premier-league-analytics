import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { Activity, Goal, Shield, Sparkles, Trophy } from "lucide-react";
import api from "../api/footballApi";
import SkeletonCard from "../components/SkeletonCard";
import StateCard from "../components/StateCard";
import ChartPanel from "../components/ui/ChartPanel";
import HeroWidget from "../components/ui/HeroWidget";
import MetricCard from "../components/ui/MetricCard";
import PageHero from "../components/ui/PageHero";
import SectionHeader from "../components/ui/SectionHeader";
import dashboardHero from "../assets/backgrounds/dashboard-hero.webp";
import {
  cardHover,
  cardVariants,
  containerVariants,
  pageVariants,
} from "../lib/motion";

const COLORS = {
  emerald: "#059669",
  teal: "#14b8a6",
  purple: "#8b5cf6",
  blue: "#2563eb",
  amber: "#f59e0b",
  rose: "#f43f5e",
  slate: "#64748b",
};

const resultColors = [COLORS.emerald, COLORS.amber, COLORS.purple];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [goalsBySeason, setGoalsBySeason] = useState([]);
  const [topTeams, setTopTeams] = useState([]);
  const [matchesBySeason, setMatchesBySeason] = useState([]);
  const [topTeamsByGoals, setTopTeamsByGoals] = useState([]);
  const [avgGoalsBySeason, setAvgGoalsBySeason] = useState([]);
  const [resultsDistribution, setResultsDistribution] = useState(null);
  const [bestAttacks, setBestAttacks] = useState([]);
  const [bestDefenses, setBestDefenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadDashboard() {
    setIsLoading(true);
    setError(null);

    const requests = [
      ["summary", api.get("/summary")],
      ["goalsBySeason", api.get("/analytics/goals-by-season")],
      ["topTeams", api.get("/analytics/top-teams")],
      ["matchesBySeason", api.get("/analytics/matches-by-season")],
      ["topTeamsByGoals", api.get("/analytics/top-teams-by-goals")],
      ["avgGoalsBySeason", api.get("/analytics/avg-goals-by-season")],
      ["resultsDistribution", api.get("/analytics/results-distribution")],
      ["bestAttacks", api.get("/analytics/best-attacks")],
      ["bestDefenses", api.get("/analytics/best-defenses")],
    ];

    try {
      const results = await Promise.allSettled(
        requests.map(([, request]) => request)
      );
      const data = Object.fromEntries(
        results.map((result, index) => [
          requests[index][0],
          result.status === "fulfilled" ? result.value.data : null,
        ])
      );

      if (!data.summary) {
        throw new Error("Summary endpoint failed");
      }

      setStats(data.summary);
      setGoalsBySeason(data.goalsBySeason || []);
      setTopTeams(data.topTeams || []);
      setMatchesBySeason(data.matchesBySeason || []);
      setTopTeamsByGoals(data.topTeamsByGoals || []);
      setAvgGoalsBySeason(data.avgGoalsBySeason || []);
      setResultsDistribution(data.resultsDistribution);
      setBestAttacks(data.bestAttacks || []);

      if (data.bestDefenses?.length) {
        setBestDefenses(data.bestDefenses);
      } else {
        const fallbackDefenses = await loadDefensiveFallback();
        setBestDefenses(fallbackDefenses);
      }
    } catch {
        setError("Unable to load dashboard analytics right now.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const resultDistributionData = useMemo(() => {
    if (!resultsDistribution) return [];
    return [
      { name: "Home Wins", value: resultsDistribution.home_wins },
      { name: "Draws", value: resultsDistribution.draws },
      { name: "Away Wins", value: resultsDistribution.away_wins },
    ];
  }, [resultsDistribution]);

  return (
    <motion.div
      className="min-w-0"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <PageHero
        kicker="Premier football intelligence"
        title="Premier League Analytics"
        description="Historical football intelligence from 2000 to 2026."
        backgroundImage={dashboardHero}
        columns="lg:grid-cols-[1fr_0.9fr]"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <HeroWidget
            label="Data window"
            value="2000-2026"
            detail="Historical Premier League archive"
          />
          <HeroWidget
            label="Analysis layer"
            value="8 live charts"
            detail="Goals, teams, form and outcomes"
          />
          <HeroWidget
            label="Signal focus"
            value="League intelligence"
            detail="Scoring, dominance and efficiency"
            icon={<Sparkles size={22} />}
          />
          <HeroWidget
            label="Visual system"
            value="Premium SaaS"
            detail="Glass cards, soft depth and motion"
            icon={<Activity size={22} />}
          />
        </div>
      </PageHero>

      {error ? (
        <StateCard
          className="mt-8"
          title="Dashboard unavailable"
          message={error}
          onAction={loadDashboard}
          actionLabel="Reload dashboard"
        />
      ) : (
        <>
          <motion.section
            className="-mt-5 grid grid-cols-1 gap-4 px-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {isLoading || !stats ? (
              Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : (
              <>
                <MetricCard icon={<Trophy size={20} />} title="Seasons" value={stats.seasons} />
                <MetricCard icon={<Shield size={20} />} title="Teams" value={stats.teams} />
                <MetricCard icon={<Activity size={20} />} title="Matches" value={stats.matches} />
                <MetricCard icon={<Goal size={20} />} title="Goals" value={stats.goals} />
              </>
            )}
          </motion.section>

          <motion.section
            className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="premium-card-emerald relative overflow-hidden rounded-[2rem] p-5 sm:p-7"
              variants={cardVariants}
              whileHover={cardHover}
            >
              <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-purple-300/20 blur-3xl" />
              <p className="section-label">Executive summary</p>
              <h2 className="section-title">A league-wide performance cockpit</h2>
              <p className="mt-4 max-w-2xl text-slate-600">
                Scan long-term scoring momentum, club dominance, match volume,
                attacking power, defensive quality, and result distribution in
                one portfolio-ready analytics surface.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:items-stretch"
              variants={containerVariants}
            >
              <InsightCard label="Peak signal" value="Goals" detail="Scoring volume" tone="emerald" />
              <InsightCard label="Outcome mix" value="H/D/A" detail="Result split" tone="purple" />
              <InsightCard label="Team lens" value="Top 10s" detail="Club leaders" tone="amber" />
            </motion.div>
          </motion.section>

          <section className="mt-12">
            <SectionHeader
              kicker="League intelligence"
              title="Performance, scoring and outcome analytics"
              description="A richer view of Premier League history with clean chart explanations, readable axes, and distinct color accents for each football signal."
            />

            <motion.div
              className="bento-section lg:grid-cols-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {isLoading ? (
                <DashboardSkeleton />
              ) : (
                <>
                  <ChartPanel
                    className="lg:col-span-7"
                    title="Goals by Season"
                    badge="Scoring trend"
                    description="Total league goals by season, useful for spotting attacking eras and scoring intensity shifts."
                    heightClass="h-[22rem] sm:h-[28rem]"
                  >
                    <LineChart data={goalsBySeason} margin={{ top: 18, right: 28, left: 4, bottom: 18 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#dbe7e2" />
                      <XAxis dataKey="season" minTickGap={22} tick={{ fill: COLORS.slate, fontSize: 12 }} />
                      <YAxis width={42} tick={{ fill: COLORS.slate, fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="goals" stroke={COLORS.emerald} strokeWidth={3} dot={false} />
                    </LineChart>
                  </ChartPanel>

                  <ChartPanel
                    className="lg:col-span-5"
                    title="Match Results Distribution"
                    badge="Outcomes"
                    description="Home wins, draws and away wins across the full dataset."
                    heightClass="h-[22rem] sm:h-[28rem]"
                  >
                    <PieChart>
                      <Pie
                        data={resultDistributionData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius="48%"
                        outerRadius="76%"
                        paddingAngle={3}
                      >
                        {resultDistributionData.map((entry, index) => (
                          <Cell key={entry.name} fill={resultColors[index % resultColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ChartPanel>

                  <ChartPanel
                    className="lg:col-span-6"
                    title="Matches by Season"
                    badge="Volume"
                    description="Number of fixtures per season, showing schedule consistency and dataset coverage."
                    compact
                  >
                    <BarChart data={matchesBySeason} margin={{ top: 18, right: 24, left: 0, bottom: 18 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#dbe7e2" />
                      <XAxis dataKey="season" minTickGap={20} tick={{ fill: COLORS.slate, fontSize: 11 }} />
                      <YAxis width={38} tick={{ fill: COLORS.slate, fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="matches" fill={COLORS.blue} radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ChartPanel>

                  <ChartPanel
                    className="lg:col-span-6"
                    title="Average Goals per Match"
                    badge="Intensity"
                    description="A cleaner rate-based view of how goal-heavy each season was."
                    compact
                  >
                    <AreaChart data={avgGoalsBySeason} margin={{ top: 18, right: 24, left: 0, bottom: 18 }}>
                      <defs>
                        <linearGradient id="avgGoalsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.35} />
                          <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0.03} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#dbe7e2" />
                      <XAxis dataKey="season" minTickGap={20} tick={{ fill: COLORS.slate, fontSize: 11 }} />
                      <YAxis width={38} tick={{ fill: COLORS.slate, fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="avg_goals" stroke={COLORS.purple} fill="url(#avgGoalsGradient)" strokeWidth={3} dot={false} />
                    </AreaChart>
                  </ChartPanel>

                  <ChartPanel
                    className="lg:col-span-6"
                    title="Top 10 Teams by Wins"
                    badge="Dominance"
                    description="The clubs with the highest total wins in the historical sample."
                    compact
                  >
                    <BarChart data={topTeams} margin={{ top: 18, right: 24, left: 0, bottom: 18 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#dbe7e2" />
                      <XAxis dataKey="team" minTickGap={10} tick={{ fill: COLORS.slate, fontSize: 11 }} />
                      <YAxis width={38} tick={{ fill: COLORS.slate, fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="wins" fill={COLORS.emerald} radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ChartPanel>

                  <ChartPanel
                    className="lg:col-span-6"
                    title="Top 10 Teams by Goals"
                    badge="Firepower"
                    description="The most prolific scoring teams across all covered seasons."
                    compact
                  >
                    <BarChart data={topTeamsByGoals} margin={{ top: 18, right: 24, left: 0, bottom: 18 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#dbe7e2" />
                      <XAxis dataKey="team" minTickGap={10} tick={{ fill: COLORS.slate, fontSize: 11 }} />
                      <YAxis width={38} tick={{ fill: COLORS.slate, fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="goals" fill={COLORS.amber} radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ChartPanel>

                  <ChartPanel
                    className="lg:col-span-6"
                    title="Best Attacking Teams"
                    badge="Attack"
                    description="Teams ranked by average goals scored per match."
                    compact
                  >
                    <BarChart data={bestAttacks} margin={{ top: 18, right: 24, left: 0, bottom: 18 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#dbe7e2" />
                      <XAxis dataKey="team" minTickGap={10} tick={{ fill: COLORS.slate, fontSize: 11 }} />
                      <YAxis width={38} tick={{ fill: COLORS.slate, fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="avg_goals" fill={COLORS.teal} radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ChartPanel>

                  <ChartPanel
                    className="lg:col-span-6"
                    title="Best Defensive Teams"
                    badge="Defense"
                    description="Teams ranked by average goals conceded per match, lower values are stronger."
                    compact
                  >
                    <BarChart data={bestDefenses} margin={{ top: 18, right: 24, left: 0, bottom: 18 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#dbe7e2" />
                      <XAxis dataKey="team" minTickGap={10} tick={{ fill: COLORS.slate, fontSize: 11 }} />
                      <YAxis width={38} tick={{ fill: COLORS.slate, fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="avg_goals_conceded" fill={COLORS.rose} radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ChartPanel>
                </>
              )}
            </motion.div>
          </section>
        </>
      )}
    </motion.div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/95 p-3 text-sm shadow-xl shadow-slate-950/10 backdrop-blur">
      {label ? <p className="mb-2 font-black text-slate-950">{label}</p> : null}
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={`${item.name}-${item.value}`} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
            <span className="font-semibold text-slate-600">{item.name}:</span>
            <span className="font-black text-slate-950">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

async function loadDefensiveFallback() {
  const teamsRes = await api.get("/teams");
  const teamStats = await Promise.allSettled(
    teamsRes.data.map((team) => api.get(`/teams/${encodeURIComponent(team)}`))
  );

  return teamStats
    .filter((result) => result.status === "fulfilled")
    .map((result) => {
      const stats = result.value.data;

      return {
        team: stats.team,
        avg_goals_conceded: stats.played
          ? Number((stats.goals_conceded / stats.played).toFixed(2))
          : 0,
        total_goals_conceded: stats.goals_conceded,
        matches: stats.played,
      };
    })
    .sort((a, b) => a.avg_goals_conceded - b.avg_goals_conceded)
    .slice(0, 10);
}

function InsightCard({ label, value, detail, tone }) {
  const tones = {
    emerald: "from-emerald-50 to-white text-emerald-700 ring-emerald-200/70",
    purple: "from-purple-50 to-white text-purple-700 ring-purple-200/70",
    amber: "from-amber-50 to-white text-amber-700 ring-amber-200/70",
  };

  return (
    <motion.div
      className={`premium-card rounded-[1.35rem] bg-gradient-to-br p-4 ring-1 ${tones[tone]}`}
      variants={cardVariants}
      whileHover={{ y: -3 }}
    >
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black leading-none text-slate-950">{value}</p>
      <p className="mt-3 text-xs font-semibold text-slate-500">{detail}</p>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <SkeletonCard variant="chart" className="lg:col-span-7" />
      <SkeletonCard variant="chart" className="lg:col-span-5" />
      <SkeletonCard variant="chart" className="lg:col-span-6" />
      <SkeletonCard variant="chart" className="lg:col-span-6" />
      <SkeletonCard variant="chart" className="lg:col-span-6" />
      <SkeletonCard variant="chart" className="lg:col-span-6" />
      <SkeletonCard variant="chart" className="lg:col-span-6" />
      <SkeletonCard variant="chart" className="lg:col-span-6" />
    </>
  );
}
