import { z } from "zod";

export const createPostSchema = z.object({
  type: z.enum(["confession", "question", "poll", "hot_take"]),
  title: z.string().trim().min(0).max(120).optional(),
  content: z.string().trim().min(5).max(800),
  pollOptions: z.array(z.string().trim().min(1).max(80)).max(6).optional(),
});

export const onboardingSchema = z.object({
  college: z.string().trim().min(2).max(120),
  university: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().max(20).optional(),
  profileVisible: z.boolean().default(false),
});

export const addCommentSchema = z.object({
  content: z.string().trim().min(1).max(400),
  parentCommentId: z.string().optional(),
});

export const addReactionSchema = z.object({
  emoji: z.enum(["fire", "laugh", "skull", "heart"]),
});
