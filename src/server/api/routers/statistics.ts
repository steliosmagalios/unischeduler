import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const statisticsRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const courses = (await ctx.prisma.course.aggregate({ _count: true }))
      ._count;
    const groups = (await ctx.prisma.group.aggregate({ _count: true }))._count;
    const rooms = (await ctx.prisma.room.aggregate({ _count: true }))._count;
    const users = (await ctx.prisma.user.aggregate({ _count: true }))._count;
    const timetables = (await ctx.prisma.timetable.aggregate({ _count: true }))
      ._count;

    return {
      courses,
      groups,
      rooms,
      users,
      timetables,
    };
  }),
});
