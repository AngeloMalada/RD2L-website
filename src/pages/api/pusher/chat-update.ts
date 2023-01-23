import { pusher } from '../../../utils/pusher';
// presence channel handler
export default async function handler(req: any, res: any) {
  const { message, username, userLocation } = req.body;
  // trigger a new post event via pusher
  await pusher.trigger('presence-channel', 'chat-update', {
    message,
    username,
    userLocation,
  });

  res.json({ status: 200 });
}
