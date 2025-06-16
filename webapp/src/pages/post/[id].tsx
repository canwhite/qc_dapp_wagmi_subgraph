import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";
import { PostABI } from "@/abi";
import { contractAddress as CONTRACT_ADDRESS } from "../../../config";
import { ethers } from "ethers";
import { isNil } from "lodash-es";

const ipfsURI = "http://127.0.0.1:5001/ipfs/";

export default function Post({ post }) {
  const { address } = useAccount();
  const router = useRouter();
  const { id } = router.query;
  if (isNil(post)) return null;

  if (router.isFallback) {
    return <div className="text-center mt-10">加载中...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      {post && (
        <div>
          {/* 如果用户是所有者，显示编辑按钮 */}
          {CONTRACT_ADDRESS === address && (
            <div className="mb-6">
              <Link
                href={`/edit-post/${id}`}
                className="text-blue-500 hover:text-blue-700"
              >
                编辑文章
              </Link>
            </div>
          )}

          {/* 如果有封面图片，显示封面图片 */}
          {post?.coverImage && (
            <img
              src={post.coverImage}
              className="w-full rounded-lg shadow-lg mb-8"
              alt="文章封面"
            />
          )}

          <h1 className="text-4xl font-bold mb-8">{post.title}</h1>

          <div className="prose max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getStaticPaths() {
  let provider = new ethers.JsonRpcProvider();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, PostABI, provider);
  const data = await contract.fetchPosts();
  //   console.log("--posts--", data);

  const paths =
    data?.map((post) => ({ params: { id: post.id.toString() } })) || [];

  return {
    paths,
    fallback: true,
  };
}

// getStaticPaths 和 getStaticProps 是 Next.js 的静态生成功能
// getStaticPaths 用于预先生成所有可能的路径
// 它返回一个包含所有可能路径的数组，例如：
// {
//   paths: [
//     { params: { id: '1' } },
//     { params: { id: '2' } }
//   ],
//   fallback: true
// }

// getStaticProps 会在构建时根据 getStaticPaths 返回的路径被调用
// 它接收一个 context 参数，其中包含 params 对象
// params 对象包含了从路径中解析出的动态路由参数
// 例如，对于路径 /post/1，params 将是 { id: '1' }

// 这两个函数的配合工作流程是：
// 1. getStaticPaths 首先运行，确定所有可能的路径
// 2. 对于每个路径，Next.js 会调用 getStaticProps
// 3. getStaticProps 通过 context.params 获取当前路径的参数
// 4. 使用这些参数获取数据并生成静态页面

// 在这个例子中：
// - getStaticPaths 获取所有文章的 ID 并生成路径
// - getStaticProps 接收 { params: { id: 'some-id' } } 作为参数
// - 使用 id 从 IPFS 获取对应的文章内容

export async function getStaticProps({ params }) {
  const { id } = params;
  const ipfsUrl = `${ipfsURI}/${id}`;

  let data;

  try {
    const response = await fetch(ipfsUrl);
    const data = await response.json();

    if (data?.coverImage) {
      data.coverImage = `${ipfsURI}/${data.coverImage}`;
    }
  } catch (error) {
    console.log("--error--", error);
    data = null;
  }

  return {
    props: {
      post: data,
    },
  };
}
