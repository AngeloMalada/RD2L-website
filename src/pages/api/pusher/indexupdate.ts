import { pusher } from '../../../utils/pusher';

export default async function handler(req: any, res: any) {
  const { index } = req.body;
  await pusher.trigger('presence-cache-channel', 'index-update', {
    index,
  });

  res.json(index);
}
