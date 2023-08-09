import { clerkClient } from "@clerk/nextjs";
import { prisma } from "~/server/db";
import { type SessionData } from "~/utils/webhooks/types";

export default async function checkAndLinkUser(
  data: SessionData
): Promise<boolean> {
  // Check if user already has record
  const hasRecord =
    (await prisma.user.findFirst({ where: { externalId: data.user_id } })) !==
    null;

  if (hasRecord) {
    // console.log("do nothing");
    return true;
  }

  // Check if a record with the user's primary email exists and add it if it exists, else do nothing
  const user = await clerkClient.users.getUser(data.user_id);
  const email = user.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId
  );

  if (typeof email === "undefined") {
    // console.log("email not found");
    return true;
  }

  const record = await prisma.user.findUnique({
    where: { email: email?.emailAddress },
  });

  if (record === null) {
    // console.log("record not found");
    return true;
  }

  await prisma.user.update({
    where: { email: email?.emailAddress },
    data: {
      externalId: user.id,
    },
  });

  // console.log("All OK!");
  return true;
}
