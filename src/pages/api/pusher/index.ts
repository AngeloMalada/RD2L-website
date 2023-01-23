/* eslint-disable @typescript-eslint/no-unused-vars */
import { pusher } from '../../../utils/pusher';
// public channel handler
export default async function handler(req: any, res: any) {
  const { message, sender } = req.body;
  await pusher.trigger('chat', 'chat-event', {
    message,
    sender,
  });

  res.json({ message: 'completed' });
}
