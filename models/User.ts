import { model, models, Schema, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    anonymousHandle: { type: String, required: true, index: true },
    college: { type: String, default: "" },
    university: { type: String, default: "" },
    customUniversity: { type: String, default: "" },
    isOtherUniversity: { type: Boolean, default: false },
    phone: { type: String, default: "" },
    profileVisible: { type: Boolean, default: false },
    onboardingComplete: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema>;

const UserModel = models.User || model("User", userSchema);

export default UserModel;
