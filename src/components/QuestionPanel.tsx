import { useRef } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { AnswerButton, getAnswerState } from "./AnswerButton";
import { AiHintPanel } from "./AiHintPanel";
import { KeyboardShortcutsHelp } from "./KeyboardShortcutsHelp";
import { QuestionNav } from "./QuestionNav";
import { useQuizKeyboard } from "../hooks/useQuizKeyboard";
import {
  feedbackPop,
  springSnap,
  staggerContainer,
  staggerItem,
  useMotionTransition,
  useMotionVariants,
  usePanelSlideVariants,
  type SlideDirection,
} from "../lib/motion";

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
  inputActive?: boolean;
  correctStreak?: number;
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
  inputActive = true,
  correctStreak = 0,
  onSelect,
  onBack,
  onNext,
  canBack,
  canNext,
}: QuestionPanelProps) {
  const slideDirection = useRef<SlideDirection>(1);
  const transition = useMotionTransition(springSnap);
  const panelVariants = usePanelSlideVariants();
  const listVariants = useMotionVariants(staggerContainer);
  const itemVariants = useMotionVariants(staggerItem);
  const feedbackVariants = useMotionVariants(feedbackPop);

  const optionCount = question.options.length;

  const navigateBack = () => {
    slideDirection.current = -1;
    onBack();
  };

  const navigateNext = () => {
    slideDirection.current = 1;
    onNext();
  };

  const { highlightedIndex, setHighlightedIndex, helpOpen, closeHelp, openHelp } =
    useQuizKeyboard({
      enabled: inputActive,
      questionKey,
      optionCount,
      submitted,
      canBack,
      canNext,
      onSelect,
      onBack: navigateBack,
      onNext: navigateNext,
    });

  const feedback =
    submitted && selectedIndex !== null
      ? selectedIndex === question.answer
        ? "Riktig!"
        : "Feil. Riktig svar er markert."
      : null;

  const isCorrect = selectedIndex === question.answer;
  const showStreak = submitted && isCorrect && correctStreak >= 2;

  const hintLine =
    optionCount > 0
      ? submitted
        ? "← → eller h/l · ? hjelp"
        : `1–${optionCount} · ↑↓ · Enter · ? hjelp`
      : null;

  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center px-3 py-6 md:px-[10px] md:py-10">
      <KeyboardShortcutsHelp
        open={helpOpen}
        onClose={closeHelp}
        optionCount={optionCount}
        submitted={submitted}
      />

      <LayoutGroup id={`question-${questionKey}`}>
        <AnimatePresence
          mode="wait"
          initial={false}
          custom={slideDirection.current}
        >
          <motion.div
            key={questionKey}
            custom={slideDirection.current}
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
              role="listbox"
              aria-label="Svaralternativer"
              aria-activedescendant={
                !submitted && optionCount > 0
                  ? `${questionKey}-option-${highlightedIndex}`
                  : undefined
              }
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              {question.options.map((option, index) => {
                const state = getAnswerState(
                  index,
                  question.answer,
                  selectedIndex,
                  submitted,
                );
                const isHighlighted = !submitted && index === highlightedIndex;

                return (
                  <motion.div
                    key={`${questionKey}-opt-${index}`}
                    id={`${questionKey}-option-${index}`}
                    role="option"
                    aria-selected={isHighlighted}
                    className={[
                      "answer-choice-row",
                      isHighlighted ? "answer-choice-row--highlighted" : "",
                    ].join(" ")}
                    variants={itemVariants}
                    layout="position"
                    transition={transition}
                    onMouseEnter={() => {
                      if (!submitted) setHighlightedIndex(index);
                    }}
                  >
                    <motion.span
                      className="answer-choice-row__num"
                      aria-hidden
                      animate={
                        isHighlighted
                          ? { scale: 1.1, color: "var(--color-blue)" }
                          : { scale: 1, color: "var(--color-blue-dark)" }
                      }
                      transition={transition}
                    >
                      {index + 1}
                    </motion.span>
                    <AnswerButton
                      optionNumber={index + 1}
                      label={option}
                      state={state}
                      isHighlighted={isHighlighted}
                      disabled={submitted}
                      onClick={() => onSelect(index)}
                    />
                  </motion.div>
                );
              })}
            </motion.div>

            {hintLine && (
              <motion.p
                className="keyboard-hint-bar"
                style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}
                variants={itemVariants}
              >
                {hintLine}
                <button
                  type="button"
                  className="keyboard-hint-bar__link"
                  onClick={openHelp}
                  aria-label="Vis tastatursnarveier"
                >
                  Vis alle
                </button>
              </motion.p>
            )}

            <AiHintPanel
              questionKey={questionKey}
              question={question.text}
              options={question.options}
              correctIndex={question.answer}
              submitted={submitted}
              isCorrect={isCorrect}
              selectedIndex={selectedIndex}
            />

            <AnimatePresence mode="popLayout">
              {feedback && (
                <motion.div
                  role="status"
                  aria-live="polite"
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={feedbackVariants}
                  className={[
                    "feedback-banner rounded-[var(--radius-sm)] px-3 py-2",
                    isCorrect ? "feedback-banner--correct" : "feedback-banner--wrong",
                  ].join(" ")}
                >
                  <p
                    className="text-sm font-semibold"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: isCorrect ? "var(--color-correct)" : "var(--color-incorrect)",
                    }}
                  >
                    {feedback}
                  </p>
                  {showStreak && (
                    <motion.p
                      className="mt-0.5 text-xs font-medium"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...transition, delay: 0.1 }}
                      style={{ color: "var(--color-correct)" }}
                    >
                      {correctStreak >= 5
                        ? "Utrolig! Du er på fyr!"
                        : `${correctStreak} riktige på rad!`}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div layout="position" transition={transition}>
              <QuestionNav
                onBack={navigateBack}
                onNext={navigateNext}
                canBack={canBack}
                canNext={canNext}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}
