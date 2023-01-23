/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Pusher from 'pusher';
import { env } from '../env/client.mjs';
export const pusher = new Pusher({
  appId: env.NEXT_PUBLIC_APP_ID,
  key: env.NEXT_PUBLIC_KEY,
  secret: env.NEXT_PUBLIC_SECRET,
  cluster: env.NEXT_PUBLIC_CLUSTER,
  useTLS: true,
});
