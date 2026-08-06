export const USER_ROLES = {
    STUDENT: "student",
    RECRUITER: "recruiter",
    ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];