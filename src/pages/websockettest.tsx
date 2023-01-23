import { useSession } from 'next-auth/react';
import type { GetServerSideProps } from 'next/types';
import React, { useEffect, useState } from 'react';
import { getServerAuthSession } from '../server/common/get-server-auth-session';
import { env } from '../env/client.mjs';
import Pusher from 'pusher-js';
import axios from 'axios';

const WebSocketTest = () => {
  const username = 'test';
  const { data: session } = useSession();
  const pusher = new Pusher(env.NEXT_PUBLIC_KEY, {
    cluster: 'eu',
    // use jwts in prod
    authEndpoint: `/api/pusher/auth`,
    auth: { params: { username } },
  });

  const [chats, setChats] = useState([]);
  const [messageToSend, setMessageToSend] = useState('');
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [usersRemoved, setUsersRemoved] = useState([]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const channel = pusher.subscribe('presence-cache-channel');

    // when a new member successfully subscribes to the channel
    channel.bind('pusher:subscription_succeeded', (members: any) => {
      setOnlineUsersCount(members.count);
    });

    // when a new member joins the channel
    channel.bind('pusher:member_added', (member: any) => {
      setOnlineUsersCount((prev) => prev + 1);
    });

    channel.bind('index-update', (data: any) => {
      setIndex(data.index);
    });

    return () => {
      pusher.unsubscribe('presence-cache-channel');
    };
  }, []);
  const handleNextIndex = async () => {
    await axios.post('/api/pusher/indexupdate', {
      index: index ? (index < 7 ? index + 1 : 0) : null,
    });
  };
  return (
    <div>
      {index && <h1>{index + 1}</h1>}
      <button
        className='bg-red-800 p-4 '
        onClick={() => {
          handleNextIndex();
        }}
      >
        next index
      </button>
    </div>
  );
};

export default WebSocketTest;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (session?.user?.role === 'ADMIN') {
    return {
      props: {
        session,
      },
    };
  } else {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};
