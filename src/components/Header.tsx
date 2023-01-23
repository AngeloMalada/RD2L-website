/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="flex h-[10vh] flex-row justify-center p-4 text-2xl font-bold uppercase tracking-widest lg:justify-between">
      <Link href={"/"}>
        <img src="/logo_w.png" alt="" className="h-12" />
      </Link>
      <div className="hidden flex-row gap-8 lg:flex">
        <Link href="/">
          <span className="hover:text-[#521818]">Home</span>
        </Link>
        <Link href="/players">
          <span className="hover:text-[#521818]">Players</span>
        </Link>
        <Link href="/admindashboard">
          <span className="hover:text-[#521818]">Admin</span>
        </Link>
      </div>
    </div>
  );
};

export default Header;
