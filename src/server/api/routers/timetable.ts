import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  adminOnlyProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { type CurrentTimetable } from "~/utils/constants";

const baseTimetableSchema = z.object({
  name: z.string(),
  semester: z.enum(["Fall", "Spring"]),
});

export const timetableRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.prisma.timetable.findUnique({
        where: { id: input.id },
        include: { tasks: true },
      });

      if (item === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Timetable not found",
        });
      }

      return item;
    }),

  getPublished: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.timetable.findFirst({
      where: { published: true },
      include: {
        tasks: {
          include: {
            lecture: {
              select: {
                duration: true,
                name: true,
                Course: {
                  select: {
                    name: true,
                    semester: true,
                    id: true,
                  },
                },
                professors: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
                groups: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            room: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!data) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No published timetable found",
      });
    }

    return {
      ...data,
      tasks: data.tasks.map((task) => ({
        startTime: task.startTime,
        roomName: task.room.name,
        courseName: task.lecture.Course.name,
        courseId: task.lecture.Course.id,
        semester: task.lecture.Course.semester,
        lecture: {
          name: task.lecture.name,
          professor: task.lecture.professors.map(
            (professor) =>
              `${professor.firstName ?? ""} ${professor.lastName ?? ""}` ??
              professor.email
          ),
          groups: task.lecture.groups.map((group) => group.name),
          duration: task.lecture.duration,
        },
      })),
    } satisfies CurrentTimetable;
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.timetable.findMany();
  }),

  create: adminOnlyProcedure
    .input(baseTimetableSchema)
    .mutation(({ ctx, input }) => {
      try {
        return ctx.prisma.timetable.create({ data: input });
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Timetable could not be created.",
        });
      }
    }),

  update: adminOnlyProcedure
    .input(z.object({ id: z.number(), data: baseTimetableSchema }))
    .mutation(async ({ ctx, input }) => {
      // Check if item exists
      if (
        (await ctx.prisma.group.findFirst({ where: { id: input.id } })) === null
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Group with id "${input.id}" was not found`,
        });
      }

      return ctx.prisma.timetable.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: adminOnlyProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.timetable.delete({ where: { id: input.id } });
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Timetable not found",
        });
      }
    }),

  publish: adminOnlyProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Check if the timetable exists
      const exists =
        (await ctx.prisma.timetable.findFirst({ where: { id: input.id } })) !==
        null;

      if (!exists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The requested timetable was not found!",
        });
      }

      // Check if the timetable is generated
      const generated =
        (await ctx.prisma.timetable.findFirst({
          where: { id: input.id, generated: true },
        })) !== null;

      if (!generated) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The requested timetable is not generated!",
        });
      }

      // Unpublish every other unpublished timetable
      await ctx.prisma.timetable.updateMany({
        where: { published: true },
        data: { published: false },
      });

      // Publish this timetable
      await ctx.prisma.timetable.update({
        where: { id: input.id },
        data: { published: true },
      });
    }),

  unpublish: adminOnlyProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Unpublish this timetable
      try {
        await ctx.prisma.timetable.update({
          where: { id: input.id },
          data: { published: false },
        });
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The requested timetable was not found!",
        });
      }
    }),

  generate: adminOnlyProcedure
    .input(z.object({ id: z.number(), courses: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      const lectures = await ctx.prisma.lecture.findMany({
        where: {
          courseId: {
            in: input.courses,
          },
        },
        include: {
          professors: {
            select: {
              id: true,
              availability: true,
            },
          },
          groups: {
            select: {
              id: true,
              size: true,
              overlappedBy: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
      const rooms = await ctx.prisma.room.findMany({
        select: {
          id: true,
          type: true,
          capacity: true,
          availability: true,
        },
      });

      const body = {
        lectures: lectures.map((lecture) => ({
          id: lecture.id,
          duration: lecture.duration,
          type: lecture.type,
          professors: lecture.professors.map((professor) => professor.id),
          groups: lecture.groups.map((group) => group.id),
        })),
        professors: lectures.flatMap((lecture) => lecture.professors),
        groups: lectures.flatMap((lecture) =>
          lecture.groups.map((g) => ({
            id: g.id,
            size: g.size,
            overlapping: g.overlappedBy.map((o) => o.id),
          }))
        ),
        rooms: rooms,
      };

      console.log(JSON.stringify(body, null, 2));

      const res = await fetch("http://127.0.0.1:18080/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).catch((err: Error) => {
        console.error(`error: ${err.message}`);
        return null;
      });

      if (res !== null) {
        const resData = (await res.json()) as SchedulerResponse;

        if (resData.status === "ERROR") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: resData.error,
          });
        }

        // Remove previous tasks (if any)
        await ctx.prisma.task.deleteMany({
          where: { timetableId: input.id },
        });

        // Update the timetable
        return ctx.prisma.timetable.update({
          where: { id: input.id },
          data: {
            generated: true,
            tasks: {
              createMany: {
                data: resData.data,
              },
            },
          },
        });
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "There was an error generating the timetable.",
      });
    }),
});

type SchedulerResponse =
  | {
      status: "SUCCESS";
      error: null;
      data: {
        lectureId: number;
        roomId: number;
        startTime: number;
      };
    }
  | {
      status: "ERROR";
      error: string;
      data: null;
    };
