import { motion } from "framer-motion";
import { cardHover, cardVariants } from "../../lib/motion";

export default function MetricCard({ icon, title, value, className = "" }) {
  return (
    <motion.div
      className={`premium-card min-w-0 rounded-3xl p-5 sm:p-6 ${className}`}
      variants={cardVariants}
      whileHover={cardHover}
    >
      <div className="flex items-center justify-between gap-4">
        {icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            {icon}
          </div>
        )}
        <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        {title}
      </p>
      <h3 className="mt-2 break-words text-2xl font-black sm:text-3xl">
        {value}
      </h3>
    </motion.div>
  );
}
