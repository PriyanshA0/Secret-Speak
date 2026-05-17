import { z } from "zod";
import { UNIVERSITY_OPTIONS } from "./universities";

// Helper: ensure string is non-empty after trim
const nonEmptyTrimmedString = (min = 1, max = 500) =>
  z
    .string()
    .transform((s) => s.trim())
    .refine((s) => s.length >= min && s.length <= max, {
      message: `Must be between ${min} and ${max} characters (non-whitespace)`,
    });

export const createPostSchema = z
  .object({
    content: nonEmptyTrimmedString(1, 500),
    type: z.enum(["confession", "question", "hottake", "poll", "rant"]),
    tags: z
      .array(z.string().trim().min(1).max(30))
      .max(5)
      .optional()
      .transform((v) => v?.map((t) => t.replace(/^#/, "")).slice(0, 5)),
    poll: z
      .object({
        question: z.string().trim().min(1).max(200),
        options: z.array(z.object({ text: z.string().trim().min(1).max(100) })).min(2).max(4),
        durationHours: z.number().min(1).max(168),
        allowMultiple: z.boolean().optional().default(false),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "poll") {
      if (!data.poll) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Poll data required for type 'poll'" });
      }
    }
  });

export const createCommentSchema = z.object({
  content: nonEmptyTrimmedString(1, 280),
  parentCommentId: z.string().optional(),
});

export const reactionSchema = z.object({
  emoji: z.enum(["fire", "heart", "laugh", "wow", "sad", "angry"]),
  targetType: z.enum(["post", "comment"]),
});

export const reportSchema = z.object({
  targetType: z.enum(["post", "comment"]),
  targetId: z.string(),
  reason: z.enum(["spam", "harassment", "hate-speech", "misinformation", "other"]),
  details: z.string().trim().max(500).optional(),
});

// Onboarding: university must be one of approved options from lib/universities
export const onboardingSchema = z.object({
  university: z
    .string()
    .refine((val) => UNIVERSITY_OPTIONS.includes(val), {
      message: "University is not in the approved list",
    }),
  displayName: z.string().trim().max(160).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type ReactionInput = z.infer<typeof reactionSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
