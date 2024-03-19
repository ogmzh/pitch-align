import { CreateUser, theses, users } from "../schema";
import { db } from "..";
import { count, eq} from "drizzle-orm";

export const createUser = async (user: CreateUser) => {
  await db.insert(users).values({
    id: user.id,
  });
};

export const userExists = async (userId: string) => {
  const result = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.id, userId));
  return result[0].count === 1;
};

export const userHasTheses = async (userId: string) => {
  const result = await db.select({ count: count() }).from(theses).where(eq(theses.userId, userId));
  return result[0].count > 0;
}