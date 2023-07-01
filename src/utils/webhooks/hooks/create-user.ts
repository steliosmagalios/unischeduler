import { prisma } from "~/server/db";

export type UserData = {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string;
  email_addresses: Array<{
    email_address: string;
    id: string;
  }>;
  primary_email_address_id: string;
};

export default async function createUser(data: UserData): Promise<boolean> {
  const email = data.email_addresses.find(
    (e) => e.id === data.primary_email_address_id
  );

  if (typeof email === "undefined") {
    throw new Error("email should be provided");
  }

  // Create record in database
  try {
    await prisma.user.create({
      data: {
        externalId: data.id,
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
