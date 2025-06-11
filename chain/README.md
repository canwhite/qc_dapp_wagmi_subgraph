# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
yarn hardhat help
yarn hardhat test
REPORT_GAS=true yarn hardhat test

# init project
yarn hardhat #init
yarn hardhat node # run stand-alone
yarn hardhat compile # run in-progress
yarn hardhat ignition deploy ./ignition/modules/deploy.ts
```

### about ERC20

```shell
yarn add @openzeppelin/contracts

```

the most basic usage of ERC20

```
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ClassToken is ERC20 {
        constructor(uint256 initialSupply)
          ERC20("ClassToken", "CLT")
        {
                _mint(msg.sender, initialSupply);
        }
}

```

note that :  
the first parameter msg.sender is the first account of test accounts of hardhat  
When the ClassToken contract is deployed, the constructor may mint all the initial tokens to the deployer (i.e., Account #0).  
eg:

```
constructor() {
    _mint(msg.sender, 10000 * 10**18); // msg.sender 是 Account #0
}

```

### about **合约地址 vs 账户地址**

| 特性                 | 合约地址                              | 账户地址（如 Account #0）        |
| -------------------- | ------------------------------------- | -------------------------------- |
| **生成方式**         | 由部署者地址和随机数（nonce）计算生成 | 由私钥推导得出（或测试网预生成） |
| **控制权**           | 由合约代码逻辑控制                    | 由私钥持有者控制                 |
| **是否有代码**       | 有（存储智能合约字节码）              | 无（普通地址）                   |
| **能否主动发起交易** | ❌ 只能被动响应调用                   | ✔️ 可主动发送交易或调用合约      |
| **示例用途**         | 存储代币余额、业务逻辑                | 支付 Gas、持有代币/NFT           |

### Run stand-alone testnet to deploy smart contract to it

```shell
# run node
yarn hardhat node

# deploy
yarn hardhat ignition deploy ./ignition/modules/deploy_classtoken.ts --network localhost

#interact with ClassToken in hardhat console
yarn hardhat console  --network localhost

# then:
formatEther = ethers.formatEther;
address = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
token = await ethers.getContractAt("ClassToken", address);

totalSupply = await token.totalSupply();
formatEther(totalSupply)

```

### connect to metamask

firstly, we need connect with local chain  
Add a custom network in the upper left corner of metamask
add these data:

```
网络名称: Hardhat Localhost

RPC URL: http://localhost:8545

链ID: 31337

货币符号: ETH
```

then, how to add CLT Token：

```
确保已切换到 Hardhat Localhost 网络

点击 "资产" 选项卡

滚动到底部点击 "导入代币"
```

### warn

如果你指的是 Hardhat Network（Hardhat 提供的本地开发网络），  
每次重启 Hardhat Network（例如通过 npx hardhat node 启动的本地节点），它的状态都会重置。  
Hardhat Network 默认是临时的，数据不会持久化，因此所有已部署的合约都会丢失。你需要重新部署合约。

### deploy to sepolia testnet

1. setting on hardhat.config.ts

```
const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url:
        process.env.SEPOLIA_RPC_URL ||
        "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID", // Infura 或 Alchemy RPC URL
      accounts: [process.env.PRIVATE_KEY], // MetaMask 私钥
    },
  },
};

```

2. deploy

```
yarn hardhat ignition deploy ./ignition/modules/deploy_classtoken.ts --network sepolia

```

### verification

为了在 Sepolia Etherscan 上验证合约：

1. 安装 Etherscan 插件：
   ```
   npm install --save-dev @nomiclabs/hardhat-etherscan
   ```
2. 在 hardhat.config.js 中添加：
   ```
   require("@nomiclabs/hardhat-etherscan");
   module.exports = {
        // ... 其他配置
        etherscan: {
                apiKey: process.env.ETHERSCAN_API_KEY // 从 Etherscan 获取
        }
   };
   ```
   在 .env 中添加 Etherscan API Key：
   ```
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```
3. 验证合约：
   bash
   npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
