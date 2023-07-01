import { courseRouter } from "~/server/api/routers/course";
import { groupRouter } from "~/server/api/routers/group";
import { roomRouter } from "~/server/api/routers/room";
import { timetableRouter } from "~/server/api/routers/timetable";
import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  course: courseRouter,
  group: groupRouter,
  room: roomRouter,
  user: userRouter,
  timetable: timetableRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
