import { AnimatePresence, motion } from "motion/react";
import { AnswerButton, getAnswerState } from "./AnswerButton";
import { QuestionNav } from "./QuestionNav";
import { fadeSlide, springSnappy, staggerContainer, staggerItem, useMotionTransition, useMotionVariants } from "../lib/motion";

type Question = {
  text: string;
  options: string[];
  answer: number;
};

type QuestionPanelProps = {
  questionKey: string;
  question: Question;
  selectedIndex: number | null;
  submitted: boolean;
  onSelect: (index: number) => void;
  onBack: () => void;
  onNext: () => void;
  canBack: boolean;
  canNext: boolean;
};

export function QuestionPanel({
  questionKey,
  question,
  selectedIndex,
  submitted,
  onSelect,
  onBack,
  onNext,
  canBack,
  canNext,
}: QuestionPanelProps) {
  const transition = useMotionTransition(springSnappy);
  const panelVariants = useMotionVariants(fadeSlide);
  const listVariants = useMotionVariants(staggerContainer);
  const itemVariants = useMotionVariants(staggerItem);

  const feedback =
    submitted && selectedIndex !== null
      ? selectedIndex === question.answer
        ? "Riktig!"
        : "Feil. Riktig svar er markert."
      : null;

  const isCorrect = selectedIndex === question.answer;

  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center bg-[var(--color-surface)] px-3 py-6 md:px-[10px] md:py-10">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={questionKey}
          className="flex w-full max-w-[400px] flex-col gap-3"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={panelVariants}
          transition={transition}
        >
          <motion.p
            className="text-lg font-medium leading-snug md:text-[20px]"
            style={{ fontFamily: "var(--font-question)", color: "var(--color-text)" }}
            variants={itemVariants}
          >
            {question.text}
          </motion.p>

          <motion.div
            className="flex flex-col gap-2"
            role="group"
            aria-label="Svaralternativer"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {question.options.map((option, index) => (
              <motion.div key={index} variants={itemVariants}>
                <AnswerButton
                  label={option}
                  state={getAnswerState(
                    index,
                    question.answer,
                    selectedIndex,
                    submitted,
                  )}
                  disabled={submitted}
                  onClick={() => onSelect(index)}
                />
              </motion.div>
            ))}
          </motion.div>

          <AnimatePresence>
            {feedback && (
              <motion.p
                className="text-sm font-medium"
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4 }}
                transition={transition}
                style={{
                  fontFamily: "var(--font-body)",
                  color: isCorrect ? "var(--color-correct)" : "var(--color-incorrect)",
                }}
              >
                {feedback}
              </motion.p>
            )}
          </AnimatePresence>

          <QuestionNav
            onBack={onBack}
            onNext={onNext}
            canBack={canBack}
            canNext={canNext}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
