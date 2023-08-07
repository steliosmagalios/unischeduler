import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  adminOnlyProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

const baseCourseSchema = z.object({
  code: z.string(),
  name: z.string(),
  semester: z.number().min(0).max(8),
});

const baseLectureSchema = z.object({
  name: z.string(),
  duration: z.number(),
  type: z.enum(["Auditorium", "Laboratory"]),
  professors: z.array(z.number()),
  groups: z.array(z.number()),
});

export const courseRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.prisma.course.findUnique({
        where: { id: input.id },
      });

      if (item === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      return item;
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.course.findMany({
      orderBy: {
        semester: "asc",
      },
    });
  }),

  getFromTimetable: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const timetable = await ctx.prisma.timetable.findFirst({
        where: { id: input.id },
      });

      if (timetable === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Timetable not found",
        });
      }

      const semester = timetable.semester === "Fall" ? 1 : 2;
      const semesterArr = Array.from(
        { length: 10 },
        (_, i) => i * 2 + semester // FIXME: this needs a refactor, but it's good enough for now
      );

      return ctx.prisma.course.findMany({
        where: {
          semester: {
            in: semesterArr,
          },
        },
        orderBy: {
          semester: "asc",
        },
      });
    }),

  getLectures: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.lecture.findMany({
        where: { courseId: input.id },
        include: {
          professors: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          groups: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    }),

  createLecture: adminOnlyProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.lecture.create({
        data: {
          name: "New Lecture",
          duration: 1,
          type: "Auditorium",
          Course: {
            connect: {
              id: input.id,
            },
          },
        },
      });
    }),

  updateLecture: adminOnlyProcedure
    .input(z.object({ id: z.number(), data: baseLectureSchema }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.lecture.update({
        where: { id: input.id },
        data: {
          name: input.data.name,
          duration: input.data.duration,
          type: input.data.type,
          professors: {
            set: input.data.professors.map((p) => ({ id: p })),
          },
          groups: {
            set: input.data.groups.map((g) => ({ id: g })),
          },
        },
      });
    }),

  deleteLecture: adminOnlyProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.lecture.delete({ where: { id: input.id } });
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lecture not found",
        });
      }
    }),

  create: adminOnlyProcedure
    .input(baseCourseSchema)
    .mutation(({ ctx, input }) => {
      try {
        return ctx.prisma.course.create({ data: input });
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Course could not be created.",
        });
      }
    }),

  update: adminOnlyProcedure
    .input(z.object({ id: z.number(), data: baseCourseSchema }))
    .mutation(async ({ ctx, input }) => {
      // Check if item exists
      if (
        (await ctx.prisma.course.findFirst({ where: { id: input.id } })) ===
        null
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Group with id "${input.id}" was not found`,
        });
      }

      try {
        return ctx.prisma.course.update({
          where: { id: input.id },
          data: input.data,
        });
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Course could not be created.",
        });
      }
    }),

  delete: adminOnlyProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.course.delete({ where: { id: input.id } });
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }
    }),
});
