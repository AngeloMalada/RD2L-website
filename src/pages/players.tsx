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
  const [drafted, setDrafted] = React.useState(true);
  const { data: players } = trpc.players.getAllPlayers.useQuery(undefined, {
    enabled: session?.user !== undefined,
  });

  const handleSelectTeam = async (playerId: string) => {
    const teamId = Number(selectTeam);
    const userId = playerId;

    addTeam.mutate({ teamId, userId });
    if (selectTeam === "") {
      alert("Please select a team");
    }
  };
  return (
    <div className="flex flex-col items-center gap-20">
      <h1 className="text-3xl font-bold uppercase">players</h1>
      <div className="flex flex-row gap-4">
        <button
          onClick={() => setDrafted(true)}
          className="rounded-lg bg-[#353535] p-4  text-white"
        >
          All Players
        </button>
        <button
          onClick={() => setDrafted(false)}
          className="rounded-lg bg-[#353535] p-4 text-white"
        >
          Undrafted Players
        </button>
      </div>
      <div className="flex w-full flex-col gap-8 px-24">
        {players?.map((player) => {
          return (
            <div key={player.id} className="w-full ">
              {(!player.teamId || drafted) && (
                <div
                  key={player.id}
                  className="flex w-full flex-row items-center justify-between gap-4 rounded-xl  p-4 text-center shadow-xl"
                >
                  <div className="flex w-full flex-row items-center justify-between gap-4 ">
                    <div className="flex flex-row items-center gap-4">
                      <img
                        src={player.image as string}
                        alt=""
                        className="w-12 rounded-lg"
                      />
                      <h1>{player.name}</h1>
                    </div>
                    <div className="flex flex-row justify-end gap-4">
                      <h1>{player.dotabuff}</h1>
                      <h1>
                        {player.dotabuff?.replace(
                          "https://www.dotabuff.com/players/",
                          ""
                        )}
                      </h1>
                    </div>
                  </div>
                  {session?.user?.role === "ADMIN" && !player.teamId && (
                    <div className="flex flex-row gap-4 ">
                      <select
                        name="team"
                        id=""
                        onChange={(e) => setSelectTeam(e.target.value)}
                        className="rounded-lg bg-[#353535] p-4  text-white"
                      >
                        <option value="">Select team</option>
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
                        Submit
                      </button>
                    </div>
                  )}
                </div>
              )}
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
