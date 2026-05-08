import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import api from "../api/footballApi";
import SkeletonCard from "../components/SkeletonCard";
import {
  cardHover,
  cardVariants,
  containerVariants,
  pageVariants,
} from "../lib/motion";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [goalsBySeason, setGoalsBySeason] = useState([]);
  const [topTeams, setTopTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <motion.div
      className="min-w-0"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-3xl font-bold sm:text-4xl">Premier League Dashboard</h1>
      <p className="mt-2 text-slate-500">
        Real EPL statistics from 2000 to 2026.
      </p>

      <motion.section
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-8 lg:grid-cols-4 lg:gap-5"
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
            <StatCard title="Saisons" value={stats.seasons} />
            <StatCard title="Equipes" value={stats.teams} />
            <StatCard title="Matchs" value={stats.matches} />
            <StatCard title="Buts" value={stats.goals} />
          </>
        )}
      </motion.section>

      <motion.section
        className="mt-6 grid grid-cols-1 gap-4 lg:mt-8 lg:grid-cols-2 lg:gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {isLoading ? (
          <>
            <SkeletonCard variant="chart" />
            <SkeletonCard variant="chart" />
          </>
        ) : (
          <>
            <ChartCard title="Goals by Season">
              <LineChart data={goalsBySeason}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="season" />
                <YAxis />
                <Tooltip />
                <Line dataKey="goals" />
              </LineChart>
            </ChartCard>

            <ChartCard title="Top 10 Teams by Wins">
              <BarChart data={topTeams}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="team" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="wins" />
              </BarChart>
            </ChartCard>
          </>
        )}
      </motion.section>
    </motion.div>
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
      <h3 className="mt-2 break-words text-2xl font-bold sm:mt-3 sm:text-3xl">{value}</h3>
    </motion.div>
  );
}

function ChartCard({ title, children }) {
  return (
    <motion.div
      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      variants={cardVariants}
      whileHover={cardHover}
    >
      <h2 className="mb-4 text-xl font-bold sm:mb-6 sm:text-2xl">{title}</h2>
      <div className="h-64 min-w-0 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
