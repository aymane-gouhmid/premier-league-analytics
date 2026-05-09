import { motion } from "framer-motion";

export default function StatTile({ label, value, surface = true }) {
  return (
    <motion.div
      className={`${surface ? "premium-surface" : "premium-card"} min-w-0 rounded-2xl p-3 sm:p-4`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
      <h3 className="mt-2 break-words text-2xl font-black">{value}</h3>
    </motion.div>
  );
}
