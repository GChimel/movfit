import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export const getAuthSession = () => {
  return getServerSession(authOptions);
};
