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
          captainId: input.captain,
        },
      });
      const selectCaptain = await ctx.prisma.user.update({
        where: {
          id: input.captain,
        },
        data: {
          teamId: team.id,
        },
      });

      return {
        team,
        selectCaptain,
      };
    }),
  getAllTeams: protectedProcedure.query(async ({ ctx }) => {
    const teams = await ctx.prisma.team.findMany();
    return teams;
  }),
});
