import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { PostABI } from "@/abi";
import { contractAddress as CONTRACT_ADDRESS } from "../../../config";
import { create } from "ipfs-http-client";

// add api/v0/add default
const client = create("http://127.0.0.1:5001");

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const initialState = { title: "", content: "" };

export default function CreatePost() {
  const [post, setPost] = useState(initialState);
  const [image, setImage] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const fileRef = useRef(null);
  const { title, content } = post;
  const router = useRouter();
  //写入使用
  const { writeContract } = useWriteContract();
  const { address } = useAccount();
  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: PostABI,
    functionName: "owner",
  });

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 500);
  }, []);

  function onChange(e) {
    setPost({ ...post, [e.target.name]: e.target.value });
  }

  async function createNewPost() {
    if (!title || !content) return;
    const hash = await savePostToIpfs();
    // console.log("---hash---", hash.toString());
    await savePost(hash);
    router.push("/");
  }

  async function savePostToIpfs() {
    try {
      const added = await client.add(JSON.stringify(post));
      return added.path;
    } catch (err) {
      console.log("error: ", err);
    }
  }

  async function savePost(hash) {
    try {
      if (!address) {
        alert("请先连接钱包");
        return;
      }

      if (address.toLowerCase() !== owner.toString().toLowerCase()) {
        alert(
          `只有合约所有者可以创建帖子。当前账户: ${address}, 所有者账户: ${owner}`
        );
        return;
      }

      console.log("调用合约参数:", {
        address: CONTRACT_ADDRESS,
        abi: PostABI,
        functionName: "createPost",
        args: [post.title, hash],
      });

      const result = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: PostABI,
        functionName: "createPost",
        args: [post.title, hash],
      });

      console.log("交易已提交:", result);
      return result;
    } catch (err) {
      console.error("创建帖子错误:", err);
      alert(`创建帖子失败: ${err.message}`);
      throw err;
    }
  }

  function triggerOnChange() {
    fileRef.current.click();
  }

  async function handleFileChange(e) {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    const added = await client.add(uploadedFile);
    setPost((state) => ({ ...state, coverImage: added.path }));
    setImage(uploadedFile);
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      {image && (
        <img
          className="max-w-full mb-8 rounded-lg shadow-lg"
          src={URL.createObjectURL(image)}
          alt="Cover"
        />
      )}
      <input
        onChange={onChange}
        name="title"
        placeholder="Give it a title ..."
        value={post.title}
        className="w-full text-4xl font-bold mb-8 outline-none bg-transparent placeholder-gray-400"
      />
      <SimpleMDE
        className="mb-8"
        placeholder="What's on your mind?"
        value={post.content}
        onChange={(value) => setPost({ ...post, content: value })}
      />
      {loaded && (
        <div className="flex gap-4">
          <button
            className="px-8 py-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            type="button"
            onClick={createNewPost}
          >
            发布
          </button>
          <button
            onClick={triggerOnChange}
            className="px-8 py-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            添加封面图片
          </button>
        </div>
      )}
      <input
        id="selectImage"
        className="hidden"
        type="file"
        onChange={handleFileChange}
        ref={fileRef}
      />
    </div>
  );
}
