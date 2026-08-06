export const INTERVIEW_DIFFICULTIES = {
    EASY: "easy",
    MEDIUM: "medium",
    HARD: "hard",
    ADAPTIVE: "adaptive",
} as const;

export type InterviewDifficulty = (typeof INTERVIEW_DIFFICULTIES)[keyof typeof INTERVIEW_DIFFICULTIES];