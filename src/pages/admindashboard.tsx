import type { GetServerSideProps } from 'next';
// import { useSession } from "next-auth/react";
import Link from 'next/link';
import React from 'react';
import { getServerAuthSession } from '../server/common/get-server-auth-session';
import { trpc } from '../utils/trpc';

const AdminDashboard = () => {
  const utils = trpc.useContext();

  const newSeason = trpc.season.newSeason.useMutation({
    onSuccess: () => {
      utils.team.getAllTeams.invalidate();
      utils.players.getAllPlayers.invalidate();
      utils.signups.getAllSignups.invalidate();
    },
  });

  // const [teamName, setTeamName] = React.useState("");
  // const [captainId, setCaptainId] = React.useState("");
  // const { data: session } = useSession();
  // const { data: divisions } = trpc.divisions.getDivisions.useQuery();
  // const createTeam = trpc.team.createTeam.useMutation({
  //   onSuccess: () => {
  //     utils.divisions.getDivisions.invalidate();
  //   },
  // });
  // const { data: player } = trpc.players.getAllPlayers.useQuery(undefined, {
  //   enabled: session?.user !== undefined,
  // });

  // const handleCreateTeam = async () => {
  //   const name = teamName;
  //   const captain = captainId;
  //   const division = 3;

  //   createTeam.mutate({ name, captain, division });
  //   if (teamName === "" || captainId === "") {
  //     alert("Please enter all fields");
  //   }
  // };

  return (
    <div className='mx-auto grid h-[60vh] grid-cols-4 place-items-center items-center justify-center'>
      <Link href='/admin/teams'>
        <button className='rounded-xl bg-white p-4 text-black'>Teams</button>
      </Link>
      <Link href='/admin/players'>
        <button className='rounded-xl bg-white p-4 text-black'>Players</button>
      </Link>
      <Link href='/admin/signups'>
        <button className='rounded-xl bg-white p-4 text-black'>Signups</button>
      </Link>
      <button
        className='rounded-xl bg-white p-4 text-black'
        onClick={() => newSeason.mutate()}
      >
        New season
      </button>
    </div>
  );

  // return (
  //   <div>
  //     {session?.user?.role === "ADMIN" ? (
  //       <div className="flex flex-col items-center gap-20">
  //         <h1>{session?.user?.role}</h1>
  //         <h1>Admin Dashboard</h1>
  //         <div className="flex flex-col  items-center gap-4">
  //           <h1>Create Team</h1>
  //           <h1>{captainId}</h1>
  //           <input
  //             className="rounded-lg bg-[#252525] text-center text-white"
  //             type="text"
  //             placeholder="Team Name"
  //             value={teamName}
  //             onChange={(e) => setTeamName(e.target.value)}
  //           />
  //           <select
  //             className="rounded-lg bg-[#521818] p-4 text-center text-white"
  //             name="captain"
  //             id=""
  //             placeholder="select a captain"
  //             onChange={(e) => setCaptainId(e.target.value)}
  //           >
  //             <option value="">Select a captain</option>
  //             {player?.map((player) => {
  //               if (player.teamId === null) {
  //                 return (
  //                   <option key={player.id} value={player.id}>
  //                     {player.name}
  //                   </option>
  //                 );
  //               }
  //             })}
  //           </select>
  //           <button
  //             className="rounded-lg bg-[#252525] p-4 text-center text-white"
  //             onClick={handleCreateTeam}
  //           >
  //             Create Team
  //           </button>
  //         </div>
  //         <div className="flex flex-col gap-8">
  //           {divisions?.map((division) => {
  //             return (
  //               <div
  //                 key={division.id}
  //                 className="flex flex-col gap-4 text-center"
  //               >
  //                 <h1>{division.name}</h1>
  //                 <div className="grid grid-cols-4 place-items-center gap-4">
  //                   {division.teams.map((team) => {
  //                     return (
  //                       <div
  //                         key={team.id}
  //                         className="flex flex-col gap-2 rounded-xl p-4 shadow-xl"
  //                       >
  //                         <h2 className="font-bold uppercase">{team.name}</h2>

  //                         <div className="flex flex-col gap-2">
  //                           {team?.players?.map((player) => {
  //                             return (
  //                               <div key={player.id}>
  //                                 <h4>{player.name}</h4>
  //                               </div>
  //                             );
  //                           })}
  //                         </div>
  //                       </div>
  //                     );
  //                   })}
  //                 </div>
  //               </div>
  //             );
  //           })}
  //         </div>
  //       </div>
  //     ) : (
  //       <div>You are not admin</div>
  //     )}
  //   </div>
  // );
};

export default AdminDashboard;

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
