import type { NextPage } from "next";
import Head from "next/head";
import { useCounter } from "@/store/index";
import dynamic from "next/dynamic";
import Posts from "@/components/posts";

const TokenBalance = dynamic(() => import("@/components/tokenBalance"), {
  ssr: false,
});

const Home: NextPage = () => {
  const { count, increment, decrement, reset } = useCounter();
  return (
    <div className="flex flex-col items-center  w-full h-full">
      <Head>
        <title>My DAPP</title>
      </Head>
      {/* ClassToken Balance */}
      {/* <div className="bg-white p-8 rounded-lg shadow-lg w-full">
        <TokenBalance />
      </div> */}
      <Posts />
    </div>
  );
};

export default Home;
