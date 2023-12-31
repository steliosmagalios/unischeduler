import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  adminOnlyProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

const baseRoomSchema = z.object({
  name: z.string(),
  capacity: z.number(),
  type: z.enum(["Auditorium", "Laboratory"]),
});

export const roomRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.prisma.room.findUnique({
        where: { id: input.id },
      });

      if (item === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Room not found",
        });
      }

      return item;
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.room.findMany();
  }),

  create: adminOnlyProcedure
    .input(baseRoomSchema)
    .mutation(({ ctx, input }) => {
      try {
        return ctx.prisma.room.create({ data: input });
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Room could not be created.",
        });
      }
    }),

  update: adminOnlyProcedure
    .input(
      z.object({
        id: z.number(),
        data: baseRoomSchema.extend({ availability: z.array(z.number()) }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if item exists
      if (
        (await ctx.prisma.room.findFirst({ where: { id: input.id } })) === null
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Room with id "${input.id}" was not found`,
        });
      }

      // Update
      return ctx.prisma.room.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: adminOnlyProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.room.delete({ where: { id: input.id } });
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Room not found",
        });
      }
    }),
});
