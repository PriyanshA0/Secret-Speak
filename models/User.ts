import { model, models, Schema, type HydratedDocument } from "mongoose";

export const PROFILE_VISIBILITY_VALUES = ["public", "campus-only", "private"] as const;

export type ProfileVisibility = (typeof PROFILE_VISIBILITY_VALUES)[number];

export interface UserAttributes {
  clerkId: string;
  anonymousHandle: string;
  university: string;
  universityDisplayName: string;
  bio: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  isOnboarded: boolean;
  isBanned: boolean;
  banReason?: string;
  profileVisibility: ProfileVisibility;
  college?: string;
  customUniversity?: string;
  isOtherUniversity?: boolean;
  phone?: string;
  profileVisible?: boolean;
  onboardingComplete?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<UserAttributes>(
  {
    clerkId: { type: String, required: true, unique: true, index: true, trim: true },
    anonymousHandle: { type: String, required: true, unique: true, index: true, trim: true },
    university: { type: String, required: true, index: true, trim: true },
    universityDisplayName: { type: String, default: "", trim: true },
    bio: { type: String, default: "", maxlength: 160, trim: true },
    postCount: { type: Number, default: 0, min: 0 },
    followerCount: { type: Number, default: 0, min: 0 },
    followingCount: { type: Number, default: 0, min: 0 },
    isOnboarded: { type: Boolean, default: false, index: true },
    isBanned: { type: Boolean, default: false, index: true },
    banReason: { type: String, default: "", trim: true },
    profileVisibility: {
      type: String,
      enum: PROFILE_VISIBILITY_VALUES,
      default: "campus-only",
      index: true,
    },
    college: { type: String, default: "", trim: true },
    customUniversity: { type: String, default: "", trim: true },
    isOtherUniversity: { type: Boolean, default: false },
    phone: { type: String, default: "", trim: true },
    profileVisible: { type: Boolean, default: false },
    onboardingComplete: { type: Boolean, default: false, index: true },
  },
  { timestamps: true, minimize: false },
);

userSchema.index({ university: 1, anonymousHandle: 1 });

export type UserDocument = HydratedDocument<UserAttributes>;

const UserModel = models.User || model<UserAttributes>("User", userSchema);

export default UserModel;
