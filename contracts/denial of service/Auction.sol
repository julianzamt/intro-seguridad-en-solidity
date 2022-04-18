// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Auction is Ownable {

  address payable public currentLeader;
  uint256 public highestBid;

  struct Refund {
    address payable addr;
    uint256 amount;
  }

  Refund[] public refunds;

  function bid() external payable {
    require(msg.value > highestBid, "Bid not high enough");

    if (currentLeader != address(0)) {
      refunds.push(Refund(currentLeader, highestBid));
    }

    currentLeader = payable(msg.sender);
    highestBid = msg.value;
  }

  function refundAll() external onlyOwner {
    for (uint256 i; i < refunds.length; i++) {
      refunds[i].addr.transfer(refunds[i].amount);
    }
    delete refunds;
  }
}
