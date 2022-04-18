// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AuctionV2 {
  address payable public currentLeader;
  uint256 public highestBid;

  mapping(address => uint256) public refunds;

  function bid() external payable {
    require(msg.value > highestBid, "Bid not high enough");
    require(refunds[msg.sender] != 0, "Withdraw your refund first");

    if (currentLeader != address(0)) {
      refunds[currentLeader] += highestBid;
    }

    currentLeader = payable(msg.sender);
    highestBid = msg.value;
  }

  // Pull over push Pattern
  function withdrawRefund() external {
    uint256 refund = refunds[msg.sender];
    refunds[msg.sender] = 0;

    payable(msg.sender).transfer(refund);
  }
}
