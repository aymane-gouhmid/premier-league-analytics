import { AlertTriangle, SearchX, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { buttonMotion, cardVariants } from "../lib/motion";

export default function StateCard({
  type = "error",
  title,
  message,
  actionLabel = "Try again",
  onAction,
  className = "",
}) {
  const isError = type === "error";
  const Icon = isError ? AlertTriangle : SearchX;

  return (
    <motion.div
      className={`premium-card min-w-0 rounded-[2rem] p-6 text-center sm:p-8 ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
          isError ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"
        }`}
      >
        <Icon size={24} />
      </div>

      <h3 className="mt-5 text-xl font-black text-slate-950 sm:text-2xl">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
        {message}
      </p>

      {onAction && (
        <motion.button
          type="button"
          onClick={onAction}
          className="premium-button mx-auto mt-5 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white"
          {...buttonMotion}
        >
          <RefreshCw size={16} />
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
