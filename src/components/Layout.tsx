import React from "react";
import Footer from "./Footer";
import Header from "./Header";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Layout = ({ children }: any) => {
  return (
    <div className="min-h-screen bg-[#252525] px-10 text-white">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
