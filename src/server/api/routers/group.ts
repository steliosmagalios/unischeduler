import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  adminOnlyProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

const baseGroupProps = z.object({
  name: z.string(),
});

export const groupRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.prisma.group.findUnique({
        where: { id: input.id },
      });

      if (item === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Group not found",
        });
      }

      return item;
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.group.findMany();
  }),

  create: adminOnlyProcedure
    .input(baseGroupProps)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.group.create({ data: input });
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "There was an error creating the resource",
        });
      }
    }),

  update: adminOnlyProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        data: baseGroupProps.extend({
          overlapping: z.array(z.string().cuid()),
        }), // Maybe optional here??
      })
    )
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

      // Update
      return ctx.prisma.group.update({
        where: { id: input.id },
        data: {
          name: input.data.name,
          overlapping: {
            set: input.data.overlapping.map((id) => ({ id })),
          },
        },
      });
    }),

  delete: adminOnlyProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.group.delete({ where: { id: input.id } });
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Group not found",
        });
      }
    }),
});
