// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts-legacy/access/Ownable.sol";

contract SimpleToken is Ownable {
  mapping(address => uint256) public balanceOf;
  uint256 public totalSupply;

  constructor(uint256 _initialSupply) public {
    totalSupply = _initialSupply;
    balanceOf[msg.sender] = _initialSupply;
  }

  function transfer(address _to, uint256 _amount) public {
    require(balanceOf[msg.sender] - _amount >= 0, "Not enough tokens");
    balanceOf[msg.sender] -= _amount;
    balanceOf[_to] += _amount;
  }

  function mint(uint256 amount) external onlyOwner {
    totalSupply += amount;
    balanceOf[owner()] += amount;
  }
}
