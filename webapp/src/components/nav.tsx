import Link from "next/link";
import Image from "next/image";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ownerAddress } from "../../config";
import React from "react";

const Nav = () => {
  const { address: account, isConnected } = useAccount();

  return (
    <nav className="bg-white">
      <div className="flex border-b border-gray-200 py-5 px-7">
        {/* items-baseline：按文本基线对齐
        leading-none：消除默认行高差异
        移除transform：避免人工调整带来的不精确 */}
        <Link href="/" className="flex items-baseline">
          <span className="text-lg font-medium leading-none">Full Stack</span>
          <span className="text-sm text-gray-500 ml-2 leading-none">WEB3</span>
        </Link>

        {/* WARN :if we need to judge in component, we are supposed to use dynamic to include the sub comp */}
        {!isConnected ? (
          <ConnectButton />
        ) : (
          <span className="ml-auto text-sm">{account}</span>
        )}
      </div>
      <div className="px-16 py-8 bg-gray-50">
        <Link href="/" className="mr-10 text-base font-normal">
          Home
        </Link>
        {account === ownerAddress && (
          <Link href="/create-post" className="text-base font-normal">
            Create Post
          </Link>
        )}
      </div>
    </nav>
  );
};

export default React.memo(Nav);
