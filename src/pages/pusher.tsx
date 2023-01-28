import { useSession } from 'next-auth/react';
import type { GetServerSideProps } from 'next/types';
import React, { useEffect, useState } from 'react';
import { getServerAuthSession } from '../server/common/get-server-auth-session';
import { env } from '../env/client.mjs';
import Pusher from 'pusher-js';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { trpc } from '../utils/trpc';

const WebSocketTest = () => {
  const [division, setDivision] = useState(1);
  const { data: session } = useSession();
  const [myName, setMyName] = useState();
  const username = session?.user?.name;
  const { data: drafters } = trpc.draft.getDrafters.useQuery(
    { division: division },
    {
      enabled: session?.user !== undefined,
    },
  );

  const [nomination, setNomination] = useState();

  const [index, setIndex] = useState(null);

  const [members, setMembers] = useState(null);

  const teams = drafters?.sort((a, b) => {
    return a.coins - b.coins;
  });
  console.log(teams);
  useEffect(() => {
    const pusher = new Pusher(env.NEXT_PUBLIC_KEY, {
      cluster: 'eu',
      authEndpoint: `/api/pusher/auth`,
      auth: { params: { username } },
    });

    const channel = pusher.subscribe('presence-cache-channel');

    channel.bind('index-update', (data: any) => {
      setIndex(data.index);
    });

    channel.bind('nomination', (data: any) => {
      setNomination(data.nomination);
    });

    //set my username to variable
    channel.bind('pusher:subscription_succeeded', (members: any) => {
      console.log(members.me.info.username);
      setMyName(members.me.info.username);
      console.log(members.members);
      setMembers(members.members);
    });

    return () => {
      pusher.unsubscribe('presence-cache-channel');
    };
  }, []);
  const handleNextIndex = async () => {
    await axios.post('/api/pusher/indexupdate', {
      index: index === null ? 0 : index < 7 ? index + 1 : 0,
    });
    console.log(index);
  };

  const handleNomination = async () => {
    await axios.post('/api/pusher/nomination', {
      nomination: session?.user?.id,
    });
  };
  console.log(nomination);
  return (
    <div className='flex flex-col items-center gap-10'>
      <h1>Hello {myName}</h1>
      <h1>Members online</h1>

      {teams?.map((drafter) => {
        return (
          <div key={drafter.id}>
            <h1>{drafter.coins}</h1>
          </div>
        );
      })}

      {members != null && (
        <div className='flex flex-row gap-4'>
          {Object.values(members).map((member: any) => {
            return (
              <div key={member.username}>
                <h1>{member.username}</h1>
              </div>
            );
          })}
        </div>
      )}

      {index != null && <h1>{index === 0 ? 1 : index + 1}</h1>}

      <button
        className='bg-red-800 p-4 '
        onClick={() => {
          handleNextIndex();
        }}
      >
        next index
      </button>
      <h1>{nomination}</h1>
      <button
        className='bg-red-800 p-4'
        onClick={() => {
          handleNomination();
        }}
      >
        Nominate
      </button>
      <input
        type='number'
        min={1}
        max={3}
        className='w-[100px] bg-red-500'
        onChange={(e) => setDivision(parseInt(e.target.value))}
        value={division}
      />
      <div className='flex flex-col gap-10'>
        {drafters?.map((drafter) => {
          return (
            <div
              className='flex flex-col gap-2 rounded-xl p-10 shadow-xl shadow-white '
              key={drafter.id}
            >
              <h1>Team name: {drafter.name}</h1>
              <h1>Team coins: {drafter.coins}</h1>
              <h1>Team drafter: {drafter.drafter?.user.name}</h1>
              {drafter?.players.map((player) => {
                return (
                  <div key={player.user.id}>
                    <div className='flex flex-row justify-between'>
                      <h1>{player.user.name}</h1>
                      <h1>
                        {player.soldFor === null
                          ? 'captain'
                          : player.soldFor + ' coins'}
                      </h1>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
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
