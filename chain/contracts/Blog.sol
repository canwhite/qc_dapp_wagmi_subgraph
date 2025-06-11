//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.28;

import "hardhat/console.sol";

contract Blog{
    //fist type and second modifier 
    string public name;
    address public owner;

    uint256 private _postIds; // Replace Counters with uint256

    struct Post{
        uint id;
        string title;
        string content;
        bool published;
    }

    /** mapping can be seen as hash tables */
    /** here we create lookups for posts by id and post by ipfs hash */
    mapping(uint => Post) private idToPost;
    mapping(string => Post) private hashToPost;

    /** events facilitate communication between smart contract and their user interfaces */
    /** i.e. we can create listeners for events in the client and also use them in The Graph */
    event PostCreated(uint id, string title, string hash);
    event PostUpdated(uint id, string title, string hash, bool published);


    /** when the blog is deployed, give it a name */
    /** also set the creator as the owner of the contract */
    constructor(string memory _name){
        console.log("Deploying Blog with name:", _name);
        name = _name;
        owner = msg.sender;
    }     

    /** update the blog name */
    function  updateName(string memory _name) public {
        name = _name;
    }

    /** transfer ownership of the contract to another address*/
    function transferOwnership(address newOwner) public onlyOwner{
        owner = newOwner;
    }

    /** fetches and individual post by the content hash */
    function fetchPost(string memory hash) public view returns(Post memory){
        return hashToPost[hash];
    }

    /**  creates a new post*/
    function createPost(string memory title, string memory hash) public onlyOwner{
        _postIds++; // Manually increment the counter
        uint postId = _postIds; // Use _postIds directly
        Post storage post = idToPost[postId];
        post.id = postId;
        post.title = title;
        post.published = true;
        post.content = hash;
        hashToPost[hash] = post;
        emit PostCreated(postId, title, hash);
    }


    /** update an existing post */
    function updatePost(uint postId, string memory title, string memory hash, bool published) public onlyOwner{
        Post storage post = idToPost[postId];
        post.title = title;
        post.published = published;
        post.content = hash;
        idToPost[postId] = post;
        hashToPost[hash] = post;
        emit PostUpdated(post.id, title, hash, published);
    }


    /** fetch all posts */
    function fetchPosts() public view returns (Post[] memory) {
        uint itemCount = _postIds;
        
        Post[] memory posts = new Post[](itemCount);
        for (uint i = 0; i < itemCount; i++) {
            uint currentId = i + 1;
            Post storage currentItem = idToPost[currentId];
            posts[i] = currentItem;
        }
        return posts;
    }


    /**this modifier mean that only the owner of the contract can invoke the function  */
    modifier onlyOwner(){
        require(msg.sender == owner);
        //continue to insert and  execute the follow code
        _;
    }



}

