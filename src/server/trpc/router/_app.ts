import { router } from '../trpc';
import { authRouter } from './auth';
import { divisionsRouter } from './divisions';
import { draftRouter } from './draft';
import { seasonRouter } from './newSeason';
import { playerRouter } from './players';
import { signupRouter } from './signup';
import { teamRouter } from './team';
import { userUpdate } from './userUpdate';

export const appRouter = router({
  auth: authRouter,
  signups: signupRouter,
  updateUser: userUpdate,
  team: teamRouter,
  divisions: divisionsRouter,
  players: playerRouter,
  season: seasonRouter,
  draft: draftRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
