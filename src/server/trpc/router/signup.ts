import { router, protectedProcedure } from "../trpc";

//create a mutation
export const signupRouter = router({
  signup: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.prisma.signUp.create({
      data: {
        userId: ctx.session.user.id,
      },
    });

    return user;
  }),
});
