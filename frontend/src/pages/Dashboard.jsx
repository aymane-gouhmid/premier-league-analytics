import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { Activity, Goal, Shield, Trophy } from "lucide-react";
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
  containerVariants,
  pageVariants,
} from "../lib/motion";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [goalsBySeason, setGoalsBySeason] = useState([]);
  const [topTeams, setTopTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  function loadDashboard() {
    setIsLoading(true);
    setError(null);

    Promise.all([
      api.get("/summary"),
      api.get("/analytics/goals-by-season"),
      api.get("/analytics/top-teams"),
    ])
      .then(([summaryRes, goalsRes, topTeamsRes]) => {
        setStats(summaryRes.data);
        setGoalsBySeason(goalsRes.data);
        setTopTeams(topTeamsRes.data);
      })
      .catch(() => {
        setError("Unable to load dashboard analytics right now.");
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <motion.div
      className="min-w-0"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <PageHero
        kicker="Elite football intelligence"
        title="Premier League analytics command center"
        description="A cinematic analytics workspace for tracking scoring momentum, club dominance, match volume, and season-scale Premier League patterns from 2000 to 2026."
        backgroundImage={dashboardHero}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <HeroWidget
            label="Data window"
            value="26 seasons"
            detail="Historical EPL coverage"
          />
          <HeroWidget
            label="Analysis mode"
            value="Live API"
            detail="Charts, clubs, H2H and tables"
          />
          <HeroWidget
            className="sm:col-span-2"
            label="Platform focus"
            value="Premium sports decision layer"
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

          <section className="mt-10">
            <SectionHeader
              kicker="League pulse"
              title="Scoring trends and winning dynasties"
              description="The dashboard prioritizes the two signals analysts scan first: total goals over time and the clubs with the strongest win profiles."
            />

            <motion.div
              className="bento-section lg:grid-cols-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {isLoading ? (
                <>
                  <SkeletonCard variant="chart" className="lg:col-span-7" />
                  <SkeletonCard variant="chart" className="lg:col-span-5" />
                </>
              ) : (
                <>
                  {goalsBySeason.length ? (
                    <ChartPanel title="Goals by Season" className="lg:col-span-7">
                      <LineChart
                        data={goalsBySeason}
                        margin={{ top: 18, right: 32, left: 10, bottom: 22 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#dbe7e2" />
                        <XAxis
                          dataKey="season"
                          minTickGap={22}
                          tick={{ fill: "#64748b", fontSize: 12 }}
                          padding={{ left: 22, right: 22 }}
                        />
                        <YAxis width={42} tick={{ fill: "#64748b", fontSize: 12 }} />
                        <Tooltip />
                        <Line dataKey="goals" stroke="#059669" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ChartPanel>
                  ) : (
                    <StateCard
                      type="empty"
                      className="lg:col-span-7"
                      title="No goal trend data"
                      message="The goals-by-season dataset is empty for now."
                    />
                  )}

                  {topTeams.length ? (
                    <ChartPanel title="Top 10 Teams by Wins" className="lg:col-span-5">
                      <BarChart
                        data={topTeams}
                        margin={{ top: 18, right: 28, left: 8, bottom: 18 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#dbe7e2" />
                        <XAxis
                          dataKey="team"
                          minTickGap={12}
                          tick={{ fill: "#64748b", fontSize: 11 }}
                          padding={{ left: 18, right: 18 }}
                        />
                        <YAxis width={38} tick={{ fill: "#64748b", fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="wins" fill="#10b981" radius={[10, 10, 0, 0]} />
                      </BarChart>
                    </ChartPanel>
                  ) : (
                    <StateCard
                      type="empty"
                      className="lg:col-span-5"
                      title="No team ranking data"
                      message="The top-teams dataset is empty for now."
                    />
                  )}
                </>
              )}
            </motion.div>
          </section>
        </>
      )}
    </motion.div>
  );
}
