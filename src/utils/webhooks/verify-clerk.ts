import { type IncomingHttpHeaders } from "http";
import { buffer } from "micro";
import { type NextApiRequest } from "next";
import { Webhook, type WebhookRequiredHeaders } from "svix";

export type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
  headers: IncomingHttpHeaders & WebhookRequiredHeaders;
};

export async function verifyClerkMessage<T>(
  req: NextApiRequestWithSvixRequiredHeaders,
  secret: string
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const payload: string = (await buffer(req)).toString();
  const headers = req.headers;
  const wh = new Webhook(secret);

  try {
    return wh.verify(payload, headers) as T;
  } catch (_) {
    return null;
  }
}
