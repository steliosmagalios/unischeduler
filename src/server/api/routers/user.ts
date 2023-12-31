import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  adminOnlyProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

const baseUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(["User", "Professor", "Admin"]),
  availability: z.array(z.number()),
});

export const userRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.prisma.user.findUnique({
        where: { externalId: input.id },
      });

      if (item === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return item;
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),

  getProfessors: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      where: { role: "Professor" },
    });
  }),

  create: adminOnlyProcedure
    .input(baseUserSchema)
    .mutation(({ ctx, input }) => {
      try {
        return ctx.prisma.user.create({ data: input });
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Timetable could not be created.",
        });
      }
    }),

  update: adminOnlyProcedure
    .input(z.object({ id: z.number(), data: baseUserSchema }))
    .mutation(async ({ ctx, input }) => {
      // Check if item exists
      if (
        (await ctx.prisma.user.findFirst({ where: { id: input.id } })) === null
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Group with id "${input.id}" was not found`,
        });
      }

      return ctx.prisma.user.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  updateAvailability: adminOnlyProcedure
    .input(z.object({ id: z.number(), data: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      // Check if item exists
      if (
        (await ctx.prisma.user.findFirst({ where: { id: input.id } })) === null
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Group with id "${input.id}" was not found`,
        });
      }

      return ctx.prisma.user.update({
        where: { id: input.id },
        data: { availability: input.data },
      });
    }),

  delete: adminOnlyProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.user.delete({ where: { id: input.id } });
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
    }),
});
