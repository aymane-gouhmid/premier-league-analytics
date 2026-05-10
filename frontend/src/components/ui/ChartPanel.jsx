import { motion } from "framer-motion";
import { ResponsiveContainer } from "recharts";
import { cardHover, cardVariants } from "../../lib/motion";

export default function ChartPanel({
  title,
  description,
  children,
  className = "",
  compact = false,
  badge = "Analytics",
  heightClass,
}) {
  const chartHeight = heightClass || (compact ? "h-72" : "h-72 sm:h-96");

  return (
    <motion.section
      className={`premium-card min-w-0 rounded-[2rem] p-4 sm:p-6 ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={cardHover}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-black text-slate-950 sm:text-2xl">{title}</h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {description}
            </p>
          ) : null}
        </div>
        {badge && (
          <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
            {badge}
          </span>
        )}
      </div>
      <div className={`premium-surface min-w-0 rounded-3xl px-2 py-3 sm:px-3 ${chartHeight}`}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}
