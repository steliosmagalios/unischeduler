import { prisma } from "~/server/db";
import { type UserData } from "~/utils/webhooks/types";

export default async function updateUser(data: UserData): Promise<boolean> {
  const email = data.email_addresses.find(
    (e) => e.id === data.primary_email_address_id
  );

  if (typeof email === "undefined") {
    throw new Error("email should be provided");
  }

  const recordExists =
    (await prisma.user.findUnique({ where: { externalId: data.id } })) !== null;

  if (!recordExists) {
    // we don't care
    return true;
  }

  // Update record in database
  try {
    await prisma.user.update({
      where: { externalId: data.id },
      data: {
        firstName: data.first_name,
        lastName: data.last_name,
        imageUrl: data.image_url,
        email: email.email_address,
      },
    });
  } catch (_) {
    return false;
  }

  return true;
}
