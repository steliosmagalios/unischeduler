import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getFirst: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findFirst();
  }),

  createItem: publicProcedure.mutation(({ ctx }) => {
    return ctx.prisma.example.create({ data: {} });
  }),

  remove: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.example.delete({ where: { id: input.id } });
    }),
});
