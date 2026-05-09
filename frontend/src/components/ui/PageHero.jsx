export default function PageHero({
  kicker,
  title,
  description,
  children,
  columns = "lg:grid-cols-[1.15fr_0.85fr]",
  backgroundImage,
}) {
  return (
    <section
      className="hero-panel p-5 sm:p-8 lg:p-10"
      style={
        backgroundImage
          ? {
              "--hero-image": `url(${backgroundImage})`,
            }
          : undefined
      }
    >
      {backgroundImage && (
        <>
          <div className="hero-image-layer" />
          <div className="hero-image-overlay" />
          <div className="hero-sheen" />
        </>
      )}
      <div className={`relative z-10 grid gap-8 ${columns} lg:items-end`}>
        <div>
          <span className="page-kicker">{kicker}</span>
          <h1 className="page-title">{title}</h1>
          <p className="page-copy text-base leading-7">{description}</p>
        </div>

        {children}
      </div>
    </section>
  );
}
