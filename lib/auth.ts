import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongodb";
import UserModel from "@/models/User";

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  await connectToDatabase();
  return UserModel.findOne({ clerkId: userId });
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
