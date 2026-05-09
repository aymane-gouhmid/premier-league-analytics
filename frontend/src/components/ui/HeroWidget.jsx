import { motion } from "framer-motion";
import { cardHover, cardVariants } from "../../lib/motion";

export default function HeroWidget({ label, value, detail, icon, className = "" }) {
  return (
    <motion.div
      className={`hero-widget rounded-3xl p-4 ${className}`}
      variants={cardVariants}
      whileHover={cardHover}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
          {detail && <p className="mt-1 text-sm text-slate-500">{detail}</p>}
        </div>
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}
