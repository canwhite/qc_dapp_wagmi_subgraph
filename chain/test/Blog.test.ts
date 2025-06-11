import { Blog } from "./../typechain-types/contracts/Blog";
import { GetContractTypeFromFactory } from "./../typechain-types/common";
import { ethers } from "ethers";
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Blog", async () => {
  it("Should create a post", async () => {
    const Blog = await ethers.getContractFactory("Blog");
    const blog = await Blog.deploy("My Blog");
    await blog.createPost("My first post", "12345");
    const posts = await blog.fetchPosts();
    //expect xxx to equal
    expect(posts[0].title).to.equal("My first post");
  });
  it("Should edit a post", async () => {
    const Blog = await ethers.getContractFactory("Blog");
    const blog = await Blog.deploy("My blog");
    await blog.createPost("My Second post", "12345");
    await blog.updatePost(1, "My updated post", "23456", true);

    const posts = await blog.fetchPosts();
    expect(posts[0].title).to.equal("My updated post");
  });
  it("Should update the name", async () => {
    const Blog = await ethers.getContractFactory("Blog");
    const blog = await Blog.deploy("My blog");
    expect(await blog.name()).to.equal("My blog");
    await blog.updateName("My new blog");
    expect(await blog.name()).to.equal("My new blog");
  });
});
