import React, { ReactNode } from "react";
import Header from "./header";
import dynamic from "next/dynamic";

const Nav = dynamic(() => import("./nav"), {
  ssr: false,
});

type Props = {
  children: ReactNode;
};

export function Layout(props: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* test for ClassToken */}
      {/* <Header /> */}
      <Nav />
      <main className="container mx-auto px-4 py-8 flex-grow max-w-3xl">
        {props.children}
      </main>
      <footer className="bg-gray-100 dark:bg-gray-700 p-6 text-center">
        <p className="text-base">dapp by Zack - 2025</p>
      </footer>
    </div>
  );
}
