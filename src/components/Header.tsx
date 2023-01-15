/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="flex h-[10vh] flex-row justify-between p-4 text-2xl font-bold uppercase tracking-widest">
      <img src="/logo.png" alt="" className="h-12" />
      <div className="flex flex-row gap-8">
        <Link href="/">
          <span className="hover:text-[#FFD700]">Home</span>
        </Link>
        <Link href="/players">
          <span className="hover:text-[#FFD700]">Players</span>
        </Link>
        <Link href="/admindashboard">
          <span className="hover:text-[#FFD700]">Admin</span>
        </Link>
      </div>
    </div>
  );
};

export default Header;
