export default function useMemberCall(tokenAddress,address) {
    const [memberBool] =
      useContractCall(
        address &&
          tokenAddress && {
            abi: ERC20Interface, // ABI interface of the called contract
            address: tokenAddress, // On-chain address of the deployed contract
            method: "balanceOf", // Method to be called
            args: [address], // Method arguments - address to be checked for balance
          }
      ) ?? [];
    return memberBool;
  }