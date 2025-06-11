async function main() {
  // 获取所有账户
  const accounts = await hre.ethers.getSigners();

  // 打印账户地址和余额
  console.log("Available Accounts:");
  for (let i = 0; i < accounts.length; i++) {
    const address = accounts[i].address;
    const balance = await hre.ethers.provider.getBalance(address);
    console.log(
      `Account ${i}: ${address} (Balance: ${hre.ethers.formatEther(
        balance
      )} ETH)`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
