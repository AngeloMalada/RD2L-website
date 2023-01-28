/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import type { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { getServerAuthSession } from '../../server/common/get-server-auth-session';
import { trpc } from '../../utils/trpc';
import { GiCaptainHatProfile, GiShouting } from 'react-icons/gi';
import { BiMicrophoneOff, BiMicrophone } from 'react-icons/bi';
import { AiFillCrown } from 'react-icons/ai';

const Signups = () => {
  const utils = trpc.useContext();
  const { data: session } = useSession();
  const [selectTeam, setSelectTeam] = React.useState('');
  const [soldFor, setSoldFor] = React.useState<number>();
  // const removeCaptain = trpc.team.removeCaptain.useMutation({
  //   onSuccess: () => {
  //     utils.players.getAllPlayers.invalidate();

  //     utils.signups.getAllSignups.invalidate();
  //   },
  // });

  // const addTeam = trpc.updateUser.placeUserInTeam.useMutation({
  //   onSuccess: () => {
  //     utils.players.getAllPlayers.invalidate();
  //     utils.signups.getAllSignups.invalidate();
  //   },
  // });

  const addSignupToTeam = trpc.signups.addSignupToTeam.useMutation({
    onSuccess: () => {
      utils.players.getAllPlayers.invalidate();
      utils.signups.getAllSignups.invalidate();
    },
  });
  const { data: signups } = trpc.signups.getAllSignups.useQuery(undefined, {
    enabled: session?.user !== undefined,
  });
  const { data: teams } = trpc.team.getAllTeams.useQuery(undefined, {
    enabled: session?.user !== undefined,
  });

  const removeFromTeam = trpc.signups.removeSignupFromTeam.useMutation({
    onSuccess: () => {
      utils.players.getAllPlayers.invalidate();
      utils.signups.getAllSignups.invalidate();
    },
  });
  const removeCaptain = trpc.team.removeCaptain.useMutation({
    onSuccess: () => {
      utils.players.getAllPlayers.invalidate();
      utils.signups.getAllSignups.invalidate();
    },
  });
  // const removeTeam = trpc.players.removePlayerFromTeam.useMutation({
  //   onSuccess: () => {
  //     utils.players.getAllPlayers.invalidate();
  //     utils.signups.getAllSignups.invalidate();
  //   },
  // });

  const handleRemoveTeam = async (playerId: number) => {
    const id = playerId;

    removeFromTeam.mutate({ id: playerId });
    removeCaptain.mutate({ captainId: id });
  };

  return (
    <div className='mt-10 flex w-full flex-col  gap-8'>
      <h1 className='text-center text-3xl font-bold uppercase'>Signups</h1>

      {signups
        ?.sort(
          true
            ? (a, b) => b.user.mmr - a.user.mmr
            : (a, b) => a.user.mmr - b.user.mmr,
        )
        .map((signup, index) => {
          return (
            <div
              key={signup.id}
              className={`${
                signup.activityCheck ? 'bg-green-500' : 'bg-[#757575]'
              } flex w-full  flex-col items-center justify-between gap-4 rounded-lg  pb-4 shadow-xl shadow-[#454545]`}
            >
              {' '}
              <Link
                rel='noopener noreferrer'
                target='_blank'
                href={`${signup.user.dotabuff ? signup.user.dotabuff : '#'}`}
                className='flex h-full flex-1  p-4'
              >
                <div className='flex  w-full flex-col items-center justify-center gap-4 '>
                  <div className='flex flex-col items-center'>
                    <span>Signup ID: {signup.id}</span>
                    <span>
                      {signup.user.dotabuff?.replace(
                        'https://www.dotabuff.com/players/',
                        '',
                      )}
                    </span>
                    <span className='font-bold uppercase'>
                      {signup.teamId === null
                        ? 'No team'
                        : teams?.find((team) => team.id === signup.teamId)
                            ?.name}
                    </span>
                  </div>
                  <div className='flex flex-row items-center gap-4'>
                    <img
                      src={signup.user.image as string}
                      alt=''
                      className='w-12 rounded-lg'
                    />
                    <span className=' '>{signup.user.name}</span>
                  </div>
                  <div className='mx-auto flex w-full  flex-col items-center justify-center gap-4 text-xs  lg:flex-row lg:text-xl'>
                    <span>{signup.user.mmr} MMR</span>
                    <div className='flex flex-row gap-2'>
                      <AiFillCrown
                        className={`${
                          false ? 'text-green-900' : 'text-red-500'
                        } `}
                      />
                      <GiShouting
                        className={`${
                          false ? 'text-green-900' : 'text-red-500'
                        } `}
                      />
                      <BiMicrophoneOff
                        className={`${
                          false ? 'text-green-900' : 'text-red-500'
                        }  `}
                      />
                    </div>

                    <div className='flex flex-row items-center gap-2'>
                      <span>1</span>
                      <img
                        src='/carry.png'
                        alt=''
                        className='aspect-square h-4 w-4'
                      />
                      <span>2</span>
                      <img src='/mid.png' alt='' className='h-4 w-4' />
                      <span>3</span>
                      <img src='/offlane.png' alt='' className='h-4 w-4' />
                      <span>4</span>
                      <img src='/soft_support.png' alt='' className='h-4 w-4' />
                      <span>5</span>
                      <img src='/hard_support.png' alt='' className='h-4 w-4' />
                    </div>
                  </div>
                </div>
              </Link>
              <div className='flex flex-col gap-4 lg:flex-row'>
                <select
                  name='team'
                  id=''
                  onChange={(e) => setSelectTeam(e.target.value)}
                  className='rounded-lg bg-[#353535] p-4 text-center text-white'
                >
                  <option value=''>Select Team</option>
                  {teams?.map((team) => {
                    if (team.id !== signup.teamId) {
                      return (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      );
                    }
                  })}
                </select>
                <input
                  type='number'
                  className='rounded-lg bg-[#353535] p-4 text-center text-white'
                  placeholder='Sold for'
                  onChange={(e) => setSoldFor(Number(e.target.value))}
                />
                <button
                  className='rounded-lg bg-[#353535] p-4 text-center text-white'
                  // onClick={() =>
                  //   addTeam.mutate({
                  //     teamId: Number(selectTeam),
                  //     userId: signup.user.id,
                  //   })
                  // }
                  onClick={() => {
                    addSignupToTeam.mutate({
                      teamId: Number(selectTeam),
                      id: signup.id,
                      soldFor: soldFor as number,
                    });
                    setSoldFor(0);
                  }}
                >
                  Submit
                </button>
                <button
                  className='rounded-lg bg-[#353535] p-4 text-center text-white'
                  onClick={() => handleRemoveTeam(signup.id)}
                >
                  Remove from team
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Signups;

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
