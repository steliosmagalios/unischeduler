import type { NextApiResponse } from "next";
import { env } from "~/env.mjs";
import checkAndLinkUser from "~/utils/webhooks/hooks/check-and-link-user";
import { type SessionData } from "~/utils/webhooks/types";
import {
  verifyClerkMessage,
  type NextApiRequestWithSvixRequiredHeaders,
} from "~/utils/webhooks/verify-clerk";

export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret: string = env.CLERK_WEBHOOK_SECRET_SESSION;

// session webhook
// this is terrible im sososososo sorry
export default async function handler(
  req: NextApiRequestWithSvixRequiredHeaders,
  res: NextApiResponse
) {
  // Verify hook
  let e: SessionEvent | null = null;
  try {
    e = await verifyClerkMessage<SessionEvent>(req, webhookSecret);
  } catch {
    return e;
  }

  if (e === null) {
    return res.status(500).json({});
  }

  let result = true;
  switch (e.type) {
    case "session.created":
      result = await checkAndLinkUser(e.data);
      break;
  }

  res.status(result ? 200 : 500).json({});
}

type SessionEvent = {
  data: SessionData;
  object: "event";
  type: EventType;
};

type EventType = "user.created" | "user.updated" | "session.created" | "*";
