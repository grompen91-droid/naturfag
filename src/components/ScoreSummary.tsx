import { memo } from "react";
import { motion } from "motion/react";
import {
  fadeUp,
  springSoft,
  staggerContainer,
  staggerItem,
  useMotionTransition,
  useMotionVariants,
} from "../lib/motion";

type ScoreSummaryProps = {
  correctCount: number;
  incorrectCount: number;
  totalQuestions: number;
};

export const ScoreSummary = memo(function ScoreSummary({
  correctCount,
  incorrectCount,
  totalQuestions,
}: ScoreSummaryProps) {
  const answered = correctCount + incorrectCount;
  const correctPct = answered > 0 ? (correctCount / answered) * 100 : 0;
  const incorrectPct = answered > 0 ? (incorrectCount / answered) * 100 : 0;
  const transition = useMotionTransition(springSoft);
  const containerVariants = useMotionVariants(staggerContainer);
  const itemVariants = useMotionVariants(staggerItem);
  const rootVariants = useMotionVariants(fadeUp);

  return (
    <motion.div
      className="mb-6 space-y-3"
      role="status"
      initial="hidden"
      animate="visible"
      variants={rootVariants}
      transition={transition}
    >
      <motion.p
        className="text-base"
        style={{ fontFamily: "var(--font-body)", color: "var(--color-text)" }}
        variants={itemVariants}
      >
        Du har svart på alle <strong className="font-semibold">{totalQuestions}</strong>{" "}
        spørsmålene. Trykk et spørsmål nedenfor for å se svaret ditt.
      </motion.p>

      <motion.div
        className="flex h-2.5 overflow-hidden rounded-full"
        aria-hidden
        style={{ backgroundColor: "var(--color-blue-light)" }}
        variants={itemVariants}
      >
        {correctCount > 0 && (
          <motion.div
            className="h-full"
            style={{ backgroundColor: "var(--color-correct)" }}
            initial={{ width: 0 }}
            animate={{ width: `${correctPct}%` }}
            transition={{ ...transition, delay: 0.08 }}
          />
        )}
        {incorrectCount > 0 && (
          <motion.div
            className="h-full"
            style={{ backgroundColor: "var(--color-incorrect)" }}
            initial={{ width: 0 }}
            animate={{ width: `${incorrectPct}%` }}
            transition={{ ...transition, delay: 0.14 }}
          />
        )}
      </motion.div>

      <motion.dl
        className="flex flex-wrap gap-x-5 gap-y-1 text-sm"
        style={{ fontFamily: "var(--font-body)" }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          { label: "Riktig", value: correctCount, color: "var(--color-correct)" },
          { label: "Feil", value: incorrectCount, color: "var(--color-incorrect)" },
          {
            label: "Besvart",
            value: `${answered} / ${totalQuestions}`,
            color: "var(--color-text)",
          },
        ].map((row) => (
          <motion.div key={row.label} className="flex gap-1.5" variants={itemVariants}>
            <dt style={{ color: "var(--color-text-muted)" }}>{row.label}</dt>
            <dd className="font-semibold tabular-nums" style={{ color: row.color }}>
              {row.value}
            </dd>
          </motion.div>
        ))}
      </motion.dl>
    </motion.div>
  );
});
