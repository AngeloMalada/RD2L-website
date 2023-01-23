/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import type { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { getServerAuthSession } from '../server/common/get-server-auth-session';
import { trpc } from '../utils/trpc';

const Draft = () => {
  const utils = trpc.useContext();
  const { data: teams } = trpc.team.getAllTeams.useQuery();
  const { data: players } = trpc.signups.getAllSignups.useQuery();
  const { data: index } = trpc.draft.getIndex.useQuery(undefined, {
    enabled: true,
    // refetchInterval: 500,
  });
  const updateIndex = trpc.draft.updateIndex.useMutation({
    onSuccess: () => {
      utils.draft.getIndex.invalidate();
    },
  });
  return (
    <div className='flex flex-row gap-40'>
      <div>
        {players ? (
          <div>{players[index?.index as number]?.user.name}</div>
        ) : (
          <div>no players</div>
        )}
      </div>
      <h1 className='bg-red-500 p-4'>{index?.index}</h1>
      <button
        className='rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700'
        onClick={() => {
          updateIndex.mutateAsync();
        }}
      >
        Next
      </button>

      <div>
        <h1>signups</h1>
        {players?.map((player) => {
          return (
            <div key={player.id}>
              <h1>{player.user.name}</h1>
            </div>
          );
        })}
      </div>

      <div>
        {teams?.map((team) => {
          return (
            <div key={team.id} className='flex flex-col'>
              <h1>Team name: {team.name}</h1>
              <span>Team coins: {team.coins}</span>
              <span>PLAYERS:</span>
              {team.players.map((player) => {
                return (
                  <div key={player.user.id}>
                    <img src={player.user.image as string} alt='' />
                    <span>{player.user.name}</span>
                    <span>{player.soldFor}</span>
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

export default Draft;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (session?.user?.drafting === true || session?.user?.role === 'ADMIN') {
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
