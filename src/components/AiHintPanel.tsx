import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { feedbackPop, useMotionVariants } from "../lib/motion";
import { useAiHint } from "../hooks/useAiHint";

type AiHintPanelProps = {
  questionKey: string;
  question: string;
  options: string[];
  correctIndex: number;
  submitted: boolean;
  isCorrect: boolean;
  selectedIndex: number | null;
};

export function AiHintPanel({
  questionKey,
  question,
  options,
  correctIndex,
  submitted,
  isCorrect,
  selectedIndex,
}: AiHintPanelProps) {
  const { hintState, explainState, requestHint, requestExplain } = useAiHint({
    questionKey,
    question,
    options,
    correctIndex,
  });

  useEffect(() => {
    if (submitted && !isCorrect && selectedIndex !== null) {
      requestExplain(selectedIndex);
    }
  }, [submitted, isCorrect, selectedIndex, requestExplain]);

  const feedbackVariants = useMotionVariants(feedbackPop);

  const showHintButton = !submitted && hintState.status === "idle";
  const showHint = !submitted && (hintState.status === "loading" || hintState.status === "ready" || hintState.status === "error");
  const showExplain = submitted && !isCorrect;

  return (
    <AnimatePresence mode="popLayout">
      {showHintButton && (
        <motion.div
          key="hint-btn"
          layout
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={feedbackVariants}
        >
          <button
            type="button"
            onClick={requestHint}
            className="ai-hint-trigger"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <span aria-hidden>✦</span> Få hint fra AI
          </button>
        </motion.div>
      )}

      {showHint && (
        <motion.div
          key="hint-box"
          layout
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={feedbackVariants}
          className="ai-hint-box ai-hint-box--hint"
        >
          <p className="ai-hint-box__label" style={{ fontFamily: "var(--font-nav)" }}>
            <span aria-hidden>✦</span> AI-hint
          </p>
          <p className="ai-hint-box__text" style={{ fontFamily: "var(--font-body)" }}>
            {hintState.status === "loading" && "Henter hint…"}
            {hintState.status === "ready" && hintState.text}
            {hintState.status === "error" && "Kunne ikke hente hint."}
          </p>
        </motion.div>
      )}

      {showExplain && (
        <motion.div
          key="explain-box"
          layout
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={feedbackVariants}
          className="ai-hint-box ai-hint-box--explain"
        >
          <p className="ai-hint-box__label" style={{ fontFamily: "var(--font-nav)" }}>
            <span aria-hidden>✦</span> AI-forklaring
          </p>
          <p className="ai-hint-box__text" style={{ fontFamily: "var(--font-body)" }}>
            {explainState.status === "loading" && "Lager forklaring…"}
            {explainState.status === "ready" && explainState.text}
            {explainState.status === "error" && "Kunne ikke hente forklaring."}
            {explainState.status === "idle" && "Lager forklaring…"}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
