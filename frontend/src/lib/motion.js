export const pageVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
};

export const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
};

export const cardHover = {
  y: -4,
  boxShadow: "0 18px 38px -24px rgba(15, 23, 42, 0.45)",
  transition: { duration: 0.22, ease: "easeOut" },
};

export const buttonMotion = {
  whileHover: { y: -2, scale: 1.01 },
  whileTap: { y: 0, scale: 0.98 },
  transition: { duration: 0.18, ease: "easeOut" },
};
