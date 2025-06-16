import { useAccount } from "wagmi";
import { ownerAddress } from "../../config";
import { PostABI } from "@/abi";
import { useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import Link from "next/link";
import { contractAddress as CONTRACT_ADDRESS } from "../../config.js";

export default function Posts() {
  const { address } = useAccount();
  const [posts, setPosts] = useState([]);

  // 读取文章列表
  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: PostABI,
    functionName: "fetchPosts",
  });

  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data]);

  if (isLoading) {
    return <div className="text-center mt-10">加载中...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="space-y-6">
        {posts.map((post, index) => (
          <Link href={`/post/${post.id}`} key={index}>
            <div className="border rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between">
              <h3 className="text-2xl font-bold">{post.title}</h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {address === ownerAddress && posts.length === 0 && (
        <div className="flex justify-center mt-24">
          <Link
            href="/create-post"
            className="bg-white px-12 py-6 text-4xl font-medium rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            创建你的第一篇文章
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 inline-block ml-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
