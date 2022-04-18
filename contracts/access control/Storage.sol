// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract Storage {
  uint256 public number;
  address public owner;

  constructor() {
    owner = msg.sender;
  }

  /**
   * @dev Store value in variable
   * @param num value to store
   */
  function store(uint256 num) public {
    require(msg.sender == owner, "Not Authorized");
    number = num;
  }

  /**
   * @dev Return value
   * @return value of 'number'
   */
  function retrieve() public view returns (uint256) {
    return number;
  }
}
