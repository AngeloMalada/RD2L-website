import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

//create a mutation
export const playerRouter = router({
  getAllPlayers: protectedProcedure.query(async ({ ctx }) => {
    const players = await ctx.prisma.user.findMany();
    return players;
  }),
});
