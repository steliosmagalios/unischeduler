import { getAuth } from "@clerk/nextjs/server";
import { type GetServerSidePropsContext } from "next";
import { prisma } from "~/server/db";

export default async function getCurrentUser(ctx: GetServerSidePropsContext) {
  const { userId } = getAuth(ctx.req);

  if (userId === null) {
    return null;
  }

  // Check if this can be cached ???
  return await prisma.user.findUnique({
    where: { externalId: userId },
  });
}
