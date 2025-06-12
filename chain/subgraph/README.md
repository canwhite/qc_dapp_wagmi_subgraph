### step 1: deploy graph-node

> PS: if you catch a error, try your best to get info from lib  
> in this case, you can get docker info from :  
> docker-compose logs -f graph-node  
> -- the meaning of -f is follow , i.e. track  
> end

1. get repo

```shell
git clone https://github.com/graphprotocol/graph-node.git
cd graph-node/docker
```

2. modify docker-compose.yaml

```shell
service:
    graph-node:
        #...
        environment:
            ethereum: "hardhat:http://host.docker.internal:8545"
            # PS: the hardhat is equal to manifest network
```

3. shutdown and run:

```shell
docker-compose down && docker-compose up -d
```

4. look for the port of current the project of docker

```shell
docker-compose ps
```

5. How to submit the obtained image to the local machine and then make it available for everyone to use？

```shell
# It means that docker tags should first be named, and then pushed to the repository. The content in your own repository can also be accessed by others, right
docker tag graphprotocol/graph-node:v0.35.0 canwhite/graph-node:v0.35.0
docker push canwhite/graph-node:v0.35.0
# if you want to use, you can:
docker pull canwhite/graph-node:v0.35.0
```

### step 2: subgraph

subgraph includes three part, manifest、 schema and mapping；

1. manifest: subgraph.yaml

```shell

specVersion: 0.0.5
schema:
  file: ./schema.graphql
features:
  - ipfsOnEthereumContracts
dataSources:
  - kind: ethereum
    name: Blog
    network: hardhat # this one is used in docker-compose.yaml
    source:
      address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
      abi: Blog
      startBlock: 2 # From deployment
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - Post
      abis:
        - name: Blog
          file: ./abis/Blog.json # you can copy from artifact
      eventHandlers:
        - event: PostCreated(uint256,string,string)
          handler: handlePostCreated
        - event: PostUpdated(uint256,string,string,bool)
          handler: handlePostUpdated
      file: ./mapping.ts

```

2. schema.graphql

```
#TODO, can not use full text， why?

type Post @entity(immutable: false) {
  id: ID!
  title: String!
  contentHash: String!
  published: Boolean!
  postContent: String!
  createdAtTimestamp: BigInt!
  updatedAtTimestamp: BigInt!
}

```

3. graph codegen from schema

```shell
graph codegen # you will get a generated package , and you can use it for mapping
```

4.  mapping

```
// graph code generate generated package so that we can create mapping.ts handily

import {
  PostCreated as PostCreatedEvent,
  PostUpdated as PostUpdatedEvent,
} from "./generated/Blog/Blog";
import { Post } from "./generated/schema";
import { ipfs, json } from "@graphprotocol/graph-ts";

export function handlePostCreated(event: PostCreatedEvent): void {
  let post = new Post(event.params.id.toString());
  post.title = event.params.title;
  post.contentHash = event.params.hash;
  let data = ipfs.cat(event.params.hash);
  if (data) {
    let value = json.fromBytes(data).toObject();
    if (value) {
      const content = value.get("content");
      if (content) {
        post.postContent = content.toString();
      }
    }
  }
  post.createdAtTimestamp = event.block.timestamp;
  post.save();
}

export function handlePostUpdated(event: PostUpdatedEvent): void {
  let post = Post.load(event.params.id.toString());
  if (post) {
    post.title = event.params.title;
    post.contentHash = event.params.hash;
    post.published = event.params.published;
    let data = ipfs.cat(event.params.hash);
    if (data) {
      let value = json.fromBytes(data).toObject();
      if (value) {
        const content = value.get("content");
        if (content) {
          post.postContent = content.toString();
        }
      }
    }
    post.updatedAtTimestamp = event.block.timestamp;
    post.save();
  }
}
```

5. build

```
graph build
```

6. deploy

```
graph deploy local-blog-subgraph --ipfs http://172.16.181.101:5001 --node http://172.16.181.101:8020 --version-label v0.0.24

# result

Build completed: QmQZgdrqPDRCU4JLA8h2e21VU2azN6C3cpo7u2Ws24SYDP

Deployed to http://172.16.181.101:8000/subgraphs/name/local-blog-subgraph/graphql

Subgraph endpoints:
Queries (HTTP):     http://172.16.181.101:8000/subgraphs/name/local-blog-subgraph

```
