import { pusher } from '../../../utils/pusher';

export default async function handler(req: any, res: any) {
  const { nomination } = req.body;
  await pusher.trigger('presence-cache-channel', 'nomination', {
    nomination,
  });

  res.json(nomination);
}
