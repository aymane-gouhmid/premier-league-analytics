export default function SkeletonCard({
  variant = "card",
  rows = 3,
  className = "",
}) {
  if (variant === "chart") {
    return (
      <div
        className={`min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 ${className}`}
      >
        <SkeletonLine className="h-6 w-44" />
        <div className="mt-6 h-64 min-w-0 rounded-xl bg-slate-100 sm:h-80">
          <div className="flex h-full items-end gap-3 px-4 pb-4">
            {[56, 74, 48, 82, 64, 70, 52].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-lg bg-slate-200"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "team") {
    return (
      <div
        className={`min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-emerald-100" />
          <SkeletonLine className="h-4 w-32" />
        </div>
      </div>
    );
  }

  if (variant === "tile") {
    return (
      <div className={`min-w-0 rounded-xl bg-slate-50 p-3 sm:p-4 ${className}`}>
        <SkeletonLine className="h-3 w-20" />
        <SkeletonLine className="mt-3 h-6 w-14" />
      </div>
    );
  }

  if (variant === "matches") {
    return (
      <div
        className={`min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 ${className}`}
      >
        <SkeletonLine className="h-6 w-40" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <SkeletonLine className="h-3 w-3/5" />
                <SkeletonLine className="mt-3 h-4 w-4/5" />
              </div>
              <div className="h-7 w-12 rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div
        className={`min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 ${className}`}
      >
        <SkeletonLine className="h-6 w-32" />
        <div className="mt-5 min-w-[760px] space-y-3 overflow-hidden">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="grid grid-cols-10 gap-3">
              {Array.from({ length: 10 }).map((__, cellIndex) => (
                <SkeletonLine
                  key={cellIndex}
                  className={cellIndex === 1 ? "h-4 w-full" : "h-4 w-10"}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 ${className}`}
    >
      <SkeletonLine className="h-4 w-24" />
      <SkeletonLine className="mt-4 h-8 w-20" />
    </div>
  );
}

function SkeletonLine({ className }) {
  return <div className={`animate-pulse rounded-full bg-slate-200 ${className}`} />;
}
