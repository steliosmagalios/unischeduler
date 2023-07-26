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
    return ctx.prisma.course.findMany();
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
