/* eslint-disable @next/next/no-img-element */
import type { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { getServerAuthSession } from '../../server/common/get-server-auth-session';
import { trpc } from '../../utils/trpc';

const Players = () => {
  const utils = trpc.useContext();
  const { data: session } = useSession();
  const { data: players } = trpc.players.getAllPlayers.useQuery(undefined, {
    enabled: session?.user !== undefined,
  });
  const banPlayer = trpc.players.banPlayer.useMutation({
    onSuccess: () => {
      utils.players.getAllPlayers.invalidate();
      utils.signups.getAllSignups.invalidate();
    },
  });

  const unbanPlayer = trpc.players.unbanPlayer.useMutation({
    onSuccess: () => {
      utils.players.getAllPlayers.invalidate();
    },
  });

  const handleBanPlayer = async (id: string) => {
    banPlayer.mutate({ id });
  };
  const handleUnbanPlayer = async (id: string) => {
    unbanPlayer.mutate({ id });
  };
  return (
    <div className='my-20 flex flex-col gap-8'>
      {players?.map((player) => {
        return (
          <div
            key={player.id}
            className={`${
              !player.banned ? '' : 'bg-red-500'
            } flex flex-row items-center justify-between gap-4 rounded-lg  shadow-xl shadow-[#454545]`}
          >
            {' '}
            <Link
              href={`${player.dotabuff}`}
              className='flex h-full flex-1  p-4'
            >
              <div className='flex flex-1 flex-row items-center gap-4 '>
                <img
                  src={player.image as string}
                  alt=''
                  className='w-12 rounded-lg'
                />
                <span className=' '>{player.name}</span>
              </div>
            </Link>
            <div className='p-4'>
              <button
                className='min-w-[100px] rounded-lg bg-white p-4 text-[#353535]'
                onClick={() => {
                  player.banned
                    ? handleUnbanPlayer(player.id)
                    : handleBanPlayer(player.id);
                }}
              >
                {player.banned ? 'unban' : 'ban'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Players;

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
