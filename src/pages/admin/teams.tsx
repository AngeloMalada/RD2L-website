import type { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import React from 'react';
import { getServerAuthSession } from '../../server/common/get-server-auth-session';
import { trpc } from '../../utils/trpc';

const Teams = () => {
  const { data: session } = useSession();
  const utils = trpc.useContext();
  const [teamName, setTeamName] = React.useState('');
  const [chooseDivision, setChooseDivision] = React.useState('');
  const [selectCaptain, setSelectCaptain] = React.useState('');
  const createTeam = trpc.team.createTeam.useMutation({
    onSuccess: () => {
      utils.divisions.getDivisions.invalidate();
      utils.team.getAllTeams.invalidate();
      utils.signups.getAllSignups.invalidate();
      utils.players.getAllPlayers.invalidate();
    },
  });
  const { data: players } = trpc.signups.getAllSignups.useQuery(undefined, {
    enabled: session?.user !== undefined,
  });

  const { data: divisions } = trpc.divisions.getDivisions.useQuery(undefined, {
    enabled: session?.user !== undefined,
    // refetchInterval: 1000,
  });

  const handleCreateTeam = async () => {
    const name = teamName;
    const captain = Number(selectCaptain);
    const division = Number(chooseDivision);

    createTeam.mutate({ name, captain, division });
    if (teamName === '' || selectCaptain === '') {
      alert('Please enter all fields');
    }
  };

  return (
    <div className='mt-20 flex flex-col gap-20  pb-20'>
      <div className='mx-auto flex  w-[40%] flex-col items-center gap-4 rounded-xl p-4 shadow-xl shadow-[#555555] transition-transform duration-300 ease-in-out hover:scale-125'>
        <h1 className='text-3xl font-bold uppercase'>Create team</h1>
        <div className='flex w-1/2 flex-col items-center  gap-2'>
          <label htmlFor=''>Team name</label>
          <input
            type='text'
            className='w-full rounded-lg p-2 text-center text-[#353535]'
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>
        <div className='flex w-1/2 flex-col items-center gap-2'>
          <label htmlFor=''>Division</label>
          <input
            type='number'
            min={1}
            max={3}
            className='w-full rounded-lg p-2 text-center text-[#353535]'
            onChange={(e) => setChooseDivision(e.target.value)}
          />
        </div>
        <div className='flex w-1/2 flex-col items-center gap-2'>
          <label htmlFor='' className=''>
            Captain
          </label>
          <h1>{selectCaptain}</h1>
          <select
            name='captain'
            id=''
            className='w-full rounded-lg p-2 text-center text-[#353535]'
            onChange={(e) => setSelectCaptain(e.target.value)}
          >
            <option value='' className=''>
              Select captain
            </option>
            {players?.map((player) => {
              if (player.teamId === null) {
                return (
                  <option value={player.id} className='' key={player.user.id}>
                    {player.user.name}
                  </option>
                );
              }
            })}
          </select>
          <button
            className='my-4 rounded-lg bg-white p-4 text-[#353535]'
            onClick={handleCreateTeam}
          >
            Create team
          </button>
        </div>
      </div>
      <div className='flex flex-col items-center gap-4'>
        <h1 className='text-3xl font-bold uppercase'>Teams</h1>
        <div className='flex w-full flex-col items-center justify-center gap-10 text-center'>
          {divisions?.map((division) => {
            return (
              <div key={division.id} className='w-full'>
                {division.teams.length > 0 && (
                  <h1 className='text-2xl font-bold uppercase '>
                    {division.name}
                  </h1>
                )}

                <div className='mx-auto grid w-[70%]  grid-cols-4 place-items-center gap-8 '>
                  {division.teams.map((team) => {
                    return (
                      <div
                        key={team.id}
                        className='rounded-lg p-4 shadow-xl shadow-white transition-transform duration-300 ease-in-out hover:scale-125'
                      >
                        <h1 className='text-xl font-bold uppercase'>
                          {team.name}
                        </h1>
                        {team.players.map((player) => {
                          return (
                            <div key={player.user.id}>
                              <h1>{player.user.name}</h1>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Teams;

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
