import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

//create a mutation
export const teamRouter = router({
  createTeam: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        captain: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const team = await ctx.prisma.team.create({
        data: {
          divisionId: 1,
          name: input.name,
          captain: input.captain,
        },
      });

      return team;
    }),
  getAllTeams: protectedProcedure.query(async ({ ctx }) => {
    const teams = await ctx.prisma.team.findMany();
    return teams;
  }),
});
