// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ClassToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("ClassToken", "CLS") {
        // 初始化代币供应量，将 initialSupply 数量的代币铸造给合约部署者
        // 这里调用 ERC20 合约的 _mint 函数，第一个参数是接收者地址，第二个参数是铸造数量
        _mint(msg.sender, initialSupply);
    }
}
