import type { GetServerSideProps, NextPage } from 'next';
// import Head from "next/head";
// import Link from "next/link";
import { signIn, signOut, useSession } from 'next-auth/react';

import { trpc } from '../utils/trpc';

// import Hero from "../components/Hero";
import { getServerAuthSession } from '../server/common/get-server-auth-session';

const Home: NextPage = () => {
  //get session data and keep it after refresh
  const { data: session } = useSession();

  //use mutation to sign up
  const signUp = trpc.signups.signup.useMutation();
  const userUpdate = trpc.updateUser.userUpdate.useMutation();

  const handleSignUp = async () => {
    const mmr = session?.user?.mmr as number;
    signUp.mutate({ mmr });
  };

  const handleUserUpdate = async () => {
    const dotabuff = 'https://www.dotabuff.com/players/72407726';
    userUpdate.mutate({ dotabuff });
  };

  return (
    <div className='flex flex-col items-center justify-center gap-8'>
      <h1>{session?.user?.email}</h1>
      <h1>holla {session?.user?.role}</h1>
      {session ? (
        <button
          className='rounded-lg bg-[#353535] p-4 text-white '
          onClick={() => signOut()}
        >
          Sign out
        </button>
      ) : (
        <button
          className='rounded-lg bg-[#353535] p-4 text-white'
          onClick={() => signIn()}
        >
          Sign in
        </button>
      )}
      <button onClick={handleSignUp}>Sign up</button>
      <button onClick={handleUserUpdate}>Update user</button>
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
