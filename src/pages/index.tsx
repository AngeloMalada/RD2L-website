import type { GetServerSideProps, NextPage } from "next";
// import Head from "next/head";
// import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

// import Hero from "../components/Hero";
import { getServerAuthSession } from "../server/common/get-server-auth-session";

const Home: NextPage = () => {
  const utils = trpc.useContext();
  //get session data and keep it after refresh
  const { data: session } = useSession();
  const { data: divisions } = trpc.divisions.getDivisions.useQuery(undefined, {
    enabled: session?.user !== undefined,
  });

  //use mutation to sign up
  const signUp = trpc.signUp.signup.useMutation();
  const userUpdate = trpc.updateUser.userUpdate.useMutation();
  const createTeam = trpc.team.createTeam.useMutation({
    onSuccess: () => {
      utils.divisions.getDivisions.invalidate();
    },
  });
  const handleSignUp = async () => {
    if (session?.user?.email) {
      signUp.mutate();
    }
  };

  const handleUserUpdate = async () => {
    const dotabuff = "https://www.dotabuff.com/players/72407726";
    userUpdate.mutate({ dotabuff });
  };

  const handleCreateTeam = async () => {
    const name = "Team 4";
    const captain = "clcxinngj0000s37eh8c6ta9n";

    createTeam.mutate({ name, captain });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <h1>{session?.user?.email}</h1>
      <h1>holla {session?.user?.role}</h1>
      {session ? (
        <button
          className="rounded-lg bg-[#353535] p-4 text-white "
          onClick={() => signOut()}
        >
          Sign out
        </button>
      ) : (
        <button
          className="rounded-lg bg-[#353535] p-4 text-white"
          onClick={() => signIn()}
        >
          Sign in
        </button>
      )}
      <button onClick={handleSignUp}>Sign up</button>
      <button onClick={handleUserUpdate}>Update user</button>
      <button onClick={handleCreateTeam}>Create team</button>
      <div>
        {divisions?.map((division: any) => {
          return (
            <div key={division.id}>
              <h1>{division.name}</h1>
              {division.teams.map((team: any) => {
                return (
                  <div key={team.id}>
                    <h2>{team.name}</h2>
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

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: {
      session,
    },
  };
};
