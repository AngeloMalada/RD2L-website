import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import React from "react";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { trpc } from "../utils/trpc";

const AdminDashboard = () => {
  const utils = trpc.useContext();
  const [teamName, setTeamName] = React.useState("");
  const [captainName, setCaptainName] = React.useState("");
  const { data: session } = useSession();
  const { data: divisions } = trpc.divisions.getDivisions.useQuery();
  const createTeam = trpc.team.createTeam.useMutation({
    onSuccess: () => {
      utils.divisions.getDivisions.invalidate();
    },
  });

  const handleCreateTeam = async () => {
    const name = teamName;
    const captain = captainName;

    createTeam.mutate({ name, captain });
  };

  return (
    <div>
      {session?.user?.role === "ADMIN" ? (
        <div className="flex flex-col items-center gap-20">
          <h1>{session?.user?.role}</h1>
          <h1>Admin Dashboard</h1>
          <div className="flex flex-col  items-center gap-4">
            <h1>Create Team</h1>
            <input
              className="rounded-lg bg-[#252525] text-center text-white"
              type="text"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <input
              type="text"
              className="rounded-lg bg-[#252525] text-center text-white"
              placeholder="Captain"
              value={captainName}
              onChange={(e) => setCaptainName(e.target.value)}
            />
            <button
              className="rounded-lg bg-[#252525] p-4 text-center text-white"
              onClick={handleCreateTeam}
            >
              Create Team
            </button>
          </div>
          <div className="flex flex-col gap-8">
            {divisions?.map((division) => {
              return (
                <div
                  key={division.id}
                  className="flex flex-col gap-4 text-center"
                >
                  <h1>{division.name}</h1>
                  <div className="grid grid-cols-4 place-items-center gap-4">
                    {division.teams.map((team) => {
                      return (
                        <div key={team.id}>
                          <h2>{team.name}</h2>
                          <h3>{team.captainId}</h3>
                          <div>
                            {team?.players?.map((player) => {
                              return (
                                <div key={player.id}>
                                  <h4>{player.name}</h4>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>You are not admin</div>
      )}
    </div>
  );
};

export default AdminDashboard;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: {
      session,
    },
  };
};
