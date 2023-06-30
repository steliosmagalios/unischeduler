import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  adminOnlyProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.prisma.userData.findUnique({
        where: { id: input.id },
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
    return ctx.prisma.userData.findMany();
  }),

  create: adminOnlyProcedure.query(() => {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }),

  update: adminOnlyProcedure.query(() => {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }),

  delete: adminOnlyProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.userData.delete({ where: { id: input.id } });
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
    }),
});
