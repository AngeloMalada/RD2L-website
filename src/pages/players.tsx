/* eslint-disable @next/next/no-img-element */
import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import React from "react";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { trpc } from "../utils/trpc";

const Players = () => {
  const utils = trpc.useContext();
  const [selectTeam, setSelectTeam] = React.useState("");
  const addTeam = trpc.updateUser.placeUserInTeam.useMutation({
    onSuccess: () => {
      utils.players.getAllPlayers.invalidate();
    },
  });
  const { data: session } = useSession();
  const { data: teams } = trpc.team.getAllTeams.useQuery();
  const { data: players } = trpc.players.getAllPlayers.useQuery(undefined, {
    enabled: session?.user !== undefined,
  });

  const handleSelectTeam = async (playerId: string) => {
    const teamId = Number(selectTeam);
    const userId = playerId;

    addTeam.mutate({ teamId, userId });
  };
  return (
    <div className="flex flex-col items-center gap-20">
      <h1>{session?.user?.role}</h1>
      <h1>Players</h1>
      <h1>Selected team id : {selectTeam}</h1>
      <div className="flex flex-col gap-8">
        {players?.map((player) => {
          return (
            <div
              key={player.id}
              className="flex flex-row items-center gap-4 text-center"
            >
              <img
                src={player.image as string}
                alt=""
                className="w-12 rounded-lg"
              />
              <h1>{player.name}</h1>
              <h1>{player.teamId}</h1>
              <h1>{player.email}</h1>
              <h1>{player.role}</h1>
              <h1>{player.dotabuff}</h1>
              <h1>
                {player.dotabuff?.replace(
                  "https://www.dotabuff.com/players/",
                  ""
                )}
              </h1>
              <select
                name="team"
                id=""
                onChange={(e) => setSelectTeam(e.target.value)}
                className="rounded-lg bg-[#353535] p-4 text-white"
              >
                {teams?.map((team) => {
                  return (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  );
                })}
              </select>
              <button
                className="rounded-lg bg-[#252525] p-4 text-center text-white"
                onClick={() => handleSelectTeam(player.id)}
              >
                Edit
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Players;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: {
      session,
    },
  };
};
