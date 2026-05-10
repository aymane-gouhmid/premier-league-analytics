import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Crown, Goal, ListOrdered } from "lucide-react";
import api from "../api/footballApi";
import SkeletonCard from "../components/SkeletonCard";
import StateCard from "../components/StateCard";
import MetricCard from "../components/ui/MetricCard";
import PageHero from "../components/ui/PageHero";
import SectionHeader from "../components/ui/SectionHeader";
import seasonsHero from "../assets/backgrounds/seasons-hero.webp";
import { teamLogos } from "../data/teamLogos";
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
  const [seasonsError, setSeasonsError] = useState(null);
  const [seasonStatsError, setSeasonStatsError] = useState(null);

  function loadSeasons() {
    setIsSeasonsLoading(true);
    setSeasonsError(null);

    api
      .get("/seasons")
      .then((res) => {
        setSeasons(res.data);
        setSelectedSeason(res.data[res.data.length - 1]);
      })
      .catch(() => setSeasonsError("Unable to load the season archive."))
      .finally(() => setIsSeasonsLoading(false));
  }

  useEffect(() => {
    loadSeasons();
  }, []);

  function loadSeasonStats(season) {
    if (!season) return;

    setIsSeasonStatsLoading(true);
    setSeasonStatsError(null);

      api
        .get(`/seasons/${season}`)
        .then((res) => {
          setSeasonStats(res.data);
        })
        .catch(() => setSeasonStatsError(`Unable to load ${season} standings.`))
        .finally(() => setIsSeasonStatsLoading(false));
  }

  useEffect(() => {
    loadSeasonStats(selectedSeason);
  }, [selectedSeason]);

  return (
    <motion.div
      className="min-w-0"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <PageHero
        kicker="Season archive"
        title="Explore every Premier League campaign"
        description="Move through the historical archive with champion snapshots, scoring totals, match volume, and full season standings."
        columns="lg:grid-cols-[1fr_0.7fr]"
        backgroundImage={seasonsHero}
      >
        <div className="hero-widget rounded-[2rem] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
            Campaign selector
          </p>
          <select
            className="premium-field mt-3 min-h-12 w-full rounded-2xl px-4 py-3 font-black outline-none"
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            disabled={isSeasonsLoading}
          >
            {seasons.map((season) => (
              <option key={season}>{season}</option>
            ))}
          </select>
        </div>
      </PageHero>

      {seasonsError && (
        <StateCard
          className="mt-8"
          title="Season archive unavailable"
          message={seasonsError}
          onAction={loadSeasons}
          actionLabel="Reload seasons"
        />
      )}

      {!isSeasonsLoading && !seasonsError && !seasons.length && (
        <StateCard
          type="empty"
          className="mt-8"
          title="No seasons found"
          message="The season archive loaded successfully, but there are no seasons to display."
        />
      )}

      {seasonStatsError && !isSeasonStatsLoading && (
        <StateCard
          className="mt-8"
          title="Season data unavailable"
          message={seasonStatsError}
          onAction={() => loadSeasonStats(selectedSeason)}
          actionLabel="Retry season"
        />
      )}

      {!seasonsError && seasons.length > 0 && !seasonStatsError && (isSeasonStatsLoading || !seasonStats) && <SeasonsSkeleton />}

      {!seasonsError && !seasonStatsError && !isSeasonStatsLoading && seasonStats && (
        <>
          <motion.section
            className="-mt-5 grid grid-cols-1 gap-4 px-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <MetricCard icon={<CalendarDays size={20} />} title="Season" value={seasonStats.season} />
            <MetricCard
              icon={<Crown size={20} />}
              title="Champion"
              value={<TeamName team={seasonStats.champion} />}
            />
            <MetricCard icon={<ListOrdered size={20} />} title="Matches" value={seasonStats.matches} />
            <MetricCard icon={<Goal size={20} />} title="Goals" value={seasonStats.goals} />
          </motion.section>

          <section className="mt-10">
            <SectionHeader
              kicker="League table"
              title="Final standings and season profile"
              description="A full-width data surface for scanning rank, records, goal difference, and points without losing the premium dashboard feel."
            />

            <motion.section
              className="premium-card mt-6 min-w-0 rounded-[2rem] p-4 sm:p-6"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={cardHover}
            >
              <div className="-mx-4 overflow-x-auto sm:mx-0">
                <table className="min-w-[820px] border-collapse text-left text-sm sm:w-full">
                  <thead>
                    <tr className="border-b border-slate-200/80 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      <th className="px-4 py-4 sm:px-0">#</th>
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
                    {(seasonStats.standings || []).map((team, index) => (
                      <motion.tr
                        key={team.team}
                        className="border-b border-slate-100/80 hover:bg-white/60"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.22,
                          delay: Math.min(index * 0.015, 0.25),
                          ease: "easeOut",
                        }}
                        whileHover={{ backgroundColor: "#f8fafc" }}
                      >
                        <td className="px-4 py-4 font-black text-slate-400 sm:px-0">
                          {index + 1}
                        </td>
                        <td className="px-3 font-black text-slate-950 sm:px-0">
                          <TeamName team={team.team} />
                        </td>
                        <td className="px-3 sm:px-0">{team.played}</td>
                        <td className="px-3 sm:px-0">{team.wins}</td>
                        <td className="px-3 sm:px-0">{team.draws}</td>
                        <td className="px-3 sm:px-0">{team.losses}</td>
                        <td className="px-3 sm:px-0">{team.goals_for}</td>
                        <td className="px-3 sm:px-0">{team.goals_against}</td>
                        <td className="px-3 sm:px-0">{team.goal_diff}</td>
                        <td className="px-3 font-black text-emerald-600 sm:px-0">
                          {team.points}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!(seasonStats.standings || []).length && (
                <StateCard
                  type="empty"
                  className="mt-5"
                  title="No standings found"
                  message="This season loaded successfully, but it has no standings rows."
                />
              )}
            </motion.section>
          </section>
        </>
      )}
    </motion.div>
  );
}

function TeamName({ team }) {
  const logo = teamLogos[team];

  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      {logo ? (
        <img
          src={logo}
          alt={team}
          className="h-8 w-8 shrink-0 rounded-xl bg-white/80 p-1.5 object-contain shadow-sm ring-1 ring-slate-200/70"
        />
      ) : null}
      <span className="min-w-0 truncate">{team}</span>
    </span>
  );
}

function SeasonsSkeleton() {
  return (
    <>
      <motion.section
        className="-mt-5 grid grid-cols-1 gap-4 px-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </motion.section>

      <div className="-mx-4 mt-10 overflow-x-auto sm:mx-0">
        <SkeletonCard variant="table" rows={10} />
      </div>
    </>
  );
}
