import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  adminOnlyProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

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
    return await ctx.prisma.timetable.findFirst({ where: { published: true } });
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

  update: adminOnlyProcedure.query(() => {
    throw new TRPCError({
      code: "FORBIDDEN",
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
    .input(z.object({ lectures: z.array(z.number()) }))
    .mutation(({ ctx, input }) => {
      throw new TRPCError({
        code: "METHOD_NOT_SUPPORTED",
        message: "Timetable generation is not currently supported",
      });
    }),
});
