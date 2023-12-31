import type { NextApiResponse } from "next";
import { env } from "~/env.mjs";
import createUser from "~/utils/webhooks/hooks/create-user";
import updateUser from "~/utils/webhooks/hooks/update-user";
import { type UserData } from "~/utils/webhooks/types";
import {
  verifyClerkMessage,
  type NextApiRequestWithSvixRequiredHeaders,
} from "~/utils/webhooks/verify-clerk";

export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret: string = env.CLERK_WEBHOOK_SECRET_USER;

// User hook
export default async function handler(
  req: NextApiRequestWithSvixRequiredHeaders,
  res: NextApiResponse
) {
  // Verify hook
  let e: UserEvent | null = null;
  try {
    e = await verifyClerkMessage<UserEvent>(req, webhookSecret);
  } catch {
    return e;
  }

  if (e === null) {
    return res.status(500).json({});
  }

  let result = true;
  switch (e.type) {
    case "user.created":
      result = await createUser(e.data);
      break;
    case "user.updated":
      result = await updateUser(e.data);
      break;
  }

  res.status(result ? 200 : 500).json({});
}

type UserEvent = {
  data: UserData;
  object: "event";
  type: EventType;
};

type EventType = "user.created" | "user.updated" | "*";
