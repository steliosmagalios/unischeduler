import type { User } from "@clerk/nextjs/dist/types/server";
import type { IncomingHttpHeaders } from "http";
import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import { Webhook, type WebhookRequiredHeaders } from "svix";
import { env } from "~/env.mjs";

// Disable the bodyParser so we can access the raw
// request body for verification.
export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret: string = env.CLERK_WEBHOOK_SECRET;

export default async function handler(
  req: NextApiRequestWithSvixRequiredHeaders,
  res: NextApiResponse
) {
  // Verify the webhook signature
  // See https://docs.svix.com/receiving/verifying-payloads/how
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const payload: string = (await buffer(req)).toString();
  const headers = req.headers;
  const wh = new Webhook(webhookSecret);

  let evt: Event | null = null;
  try {
    evt = wh.verify(payload, headers) as Event;
  } catch (_) {
    return res.status(400).json({});
  }

  // Handle the webhook
  switch (evt.type) {
    case "user.created": {
      await createUserRecord(evt.data);
      break;
    }
    case "user.updated": {
      await updateUserRecord(evt.data);
      break;
    }
    case "*":
      break;
  }

  res.json({});
}

async function createUserRecord(data: User) {
  //
}

async function updateUserRecord(data: User) {
  //
}

type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
  headers: IncomingHttpHeaders & WebhookRequiredHeaders;
};

type Event = {
  data: User;
  object: "event";
  type: EventType;
};

type EventType = "user.created" | "user.updated" | "*";
