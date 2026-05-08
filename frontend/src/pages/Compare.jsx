import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import api from "../api/footballApi";
import {
  buttonMotion,
  cardHover,
  cardVariants,
  containerVariants,
  pageVariants,
} from "../lib/motion";

export default function Compare() {
  const [teams, setTeams] = useState([]);
  const [teamA, setTeamA] = useState("Arsenal");
  const [teamB, setTeamB] = useState("Chelsea");
  const [comparison, setComparison] = useState(null);
  const [h2h, setH2h] = useState(null);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    api.get("/teams").then((res) => setTeams(res.data));
  }, []);

  async function handleCompare() {
    const compareRes = await api.get(`/compare?team_a=${teamA}&team_b=${teamB}`);
    const h2hRes = await api.get(`/head-to-head?team_a=${teamA}&team_b=${teamB}`);
    const predictionRes = await api.get(`/predict?team_a=${teamA}&team_b=${teamB}`);

    setComparison(compareRes.data);
    setH2h(h2hRes.data);
    setPrediction(predictionRes.data);
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
      <h1 className="text-3xl font-bold sm:text-4xl">Compare Teams</h1>
      <p className="mt-2 text-slate-500">
        Compare les performances historiques, les confrontations directes et la prédiction du match.
      </p>

      <motion.div
        className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:grid-cols-3 md:gap-4"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={cardHover}
      >
        <select
          className="min-h-12 min-w-0 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
          value={teamA}
          onChange={(e) => setTeamA(e.target.value)}
        >
          {teams.map((team) => (
            <option key={team}>{team}</option>
          ))}
        </select>

        <select
          className="min-h-12 min-w-0 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
          value={teamB}
          onChange={(e) => setTeamB(e.target.value)}
        >
          {teams.map((team) => (
            <option key={team}>{team}</option>
          ))}
        </select>

        <motion.button
          onClick={handleCompare}
          className="min-h-12 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
          {...buttonMotion}
        >
          Compare
        </motion.button>
      </motion.div>

      {comparison && (
        <>
          <motion.section
            className="mt-6 grid grid-cols-1 gap-4 lg:mt-8 lg:grid-cols-2 lg:gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <TeamCard data={comparison.team_a} />
            <TeamCard data={comparison.team_b} />
          </motion.section>

          <motion.section
            className="mt-6 min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:mt-8"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={cardHover}
          >
            <h2 className="mb-4 text-xl font-bold sm:mb-6 sm:text-2xl">
              Global Comparison
            </h2>

            <div className="h-64 min-w-0 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stat" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={comparison.team_a.team} />
                  <Bar dataKey={comparison.team_b.team} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.section>
        </>
      )}

      {h2h && (
        <>
          <motion.section
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-8 lg:grid-cols-5 lg:gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <StatCard title="H2H Matches" value={h2h.matches_played} />
            <StatCard title={`${h2h.team_a} Wins`} value={h2h.team_a_wins} />
            <StatCard title={`${h2h.team_b} Wins`} value={h2h.team_b_wins} />
            <StatCard title="Draws" value={h2h.draws} />
            <StatCard
              title="Goals"
              value={`${h2h.goals_team_a} - ${h2h.goals_team_b}`}
            />
          </motion.section>

          <motion.section
            className="mt-6 min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:mt-8"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={cardHover}
          >
            <h2 className="mb-4 text-xl font-bold sm:mb-6 sm:text-2xl">
              Head-to-Head Results
            </h2>

            <div className="h-64 min-w-0 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={h2hChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.section>
        </>
      )}

      {prediction && (
        <motion.section
          className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm sm:p-6 lg:mt-8"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ ...cardHover, y: -3 }}
        >
          <h2 className="text-xl font-bold text-emerald-700 sm:text-2xl">
            AI Match Prediction
          </h2>

          <p className="mt-2 text-slate-600">
            Predicted winner:{" "}
            <span className="font-bold text-emerald-700">
              {prediction.predicted_winner}
            </span>
          </p>

          <motion.div
            className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <StatCard
              title={`${prediction.team_a} Probability`}
              value={`${prediction.probability_team_a}%`}
            />
            <StatCard
              title="Draw Probability"
              value={`${prediction.probability_draw}%`}
            />
            <StatCard
              title={`${prediction.team_b} Probability`}
              value={`${prediction.probability_team_b}%`}
            />
          </motion.div>

          <p className="mt-4 text-sm text-slate-500">{prediction.note}</p>
        </motion.section>
      )}
    </motion.div>
  );
}

function TeamCard({ data }) {
  return (
    <motion.div
      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      variants={cardVariants}
      whileHover={cardHover}
    >
      <h2 className="break-words text-xl font-bold text-emerald-600 sm:text-2xl">
        {data.team}
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 md:grid-cols-3 md:gap-4">
        <Stat label="Played" value={data.played} />
        <Stat label="Wins" value={data.wins} />
        <Stat label="Draws" value={data.draws} />
        <Stat label="Losses" value={data.losses} />
        <Stat label="Goals For" value={data.goals_scored} />
        <Stat label="Goals Against" value={data.goals_conceded} />
      </div>
    </motion.div>
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

function StatCard({ title, value }) {
  return (
    <motion.div
      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
      variants={cardVariants}
      whileHover={cardHover}
    >
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-2 break-words text-xl font-bold sm:text-2xl">
        {value}
      </h3>
    </motion.div>
  );
}
