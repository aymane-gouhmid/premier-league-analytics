export default function SectionHeader({ kicker, title, description }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="section-label">{kicker}</p>
        <h2 className="section-title">{title}</h2>
      </div>
      {description && (
        <p className="max-w-lg text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}
