import dynamic from "next/dynamic";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { ClassTokenABI } from "@/abi";
import { Button } from "@/components/ui/button";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // 替换为你的合约地址，例如 0x5FbDB2315678afecb367f032d93F642f64180aa3

export default function TokenBalance({ ssrDisabled = true }) {
  const { address, isConnected } = useAccount();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  // 查询余额
  const { data: balance, isLoading: isBalanceLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ClassTokenABI,
    functionName: "balanceOf",
    args: [address], //参数
  });

  //转移代币
  const { writeContract, isLoading: isTransferLoading } = useWriteContract();
  const handleTransfer = async () => {
    if (!recipient || !amount) {
      alert("请输入收款地址和金额");
      return;
    }
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ClassTokenABI,
        functionName: "transfer",
        args: [recipient, BigInt(amount * 10 ** 18)], // 假设代币有 18 位小数
      });
      setRecipient("");
      setAmount("");
      alert("转账成功");
    } catch (error) {
      console.error(error);
      alert("转账失败");
    }
  };

  if (ssrDisabled && typeof window === "undefined") {
    return null; // 服务器渲染时返回空
  }

  return (
    <div>
      <h1 className="p-2 font-bold text-base">1. Connect To Wallet</h1>
      {/* connect */}
      <div className="w-full p-2">
        <ConnectButton />
      </div>

      {/* read */}
      <h1 className="p-2 font-bold text-base">2. Read Data</h1>

      {isConnected && (
        <div className="w-full p-2">
          <h3>你的地址: {address}</h3>
          <div className="mt-1">
            {isBalanceLoading ? (
              <p>加载余额中...</p>
            ) : (
              // 如果金额变化，这里额度瞬间变化，所以相当于自动监听的
              <p className="">
                余额: {balance ? (Number(balance) / 10 ** 18).toString() : "0"}{" "}
                CLS
              </p>
            )}
          </div>
        </div>
      )}

      {/* write */}
      <h1 className="p-2 font-bold text-base">3. Write Data</h1>
      {isConnected && (
        <div className="w-full p-2 flex flex-col ">
          <input
            className="p-1"
            type="text"
            placeholder="收款地址"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <input
            className="mt-2 p-1"
            type="number"
            placeholder="转账金额"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button
            className="bg-blue"
            onClick={handleTransfer}
            disabled={isTransferLoading}
          >
            {isTransferLoading ? "转账中..." : "转账"}
          </Button>
        </div>
      )}
    </div>
  );
}
