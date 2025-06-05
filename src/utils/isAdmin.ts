import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return null;
  }
  return session;
}
