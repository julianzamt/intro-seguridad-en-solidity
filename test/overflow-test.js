const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleToken", function () {
  let deployer, attacker, user;

  beforeEach(async function () {
    [deployer, attacker, user] = await ethers.getSigners();

    const SimpleToken = await ethers.getContractFactory(
      "SimpleToken",
      deployer
    );
    this.simpleToken = await SimpleToken.deploy(1000);
  });

  it("Should allow a user to transfer amounts smaller than or equal to its balance", async function () {
    await this.simpleToken.transfer(user.address, 1);

    expect(await this.simpleToken.balanceOf(user.address)).to.eq(1);
    expect(await this.simpleToken.balanceOf(deployer.address)).to.eq(999);
  });

  it("Should revert if the user tries to transfer an amount greater than its balance", async function () {
    await this.simpleToken.transfer(attacker.address, 10);

    await expect(
      this.simpleToken.connect(attacker).transfer(user.address, 11)
    ).to.be.revertedWith("Not enough tokens");

    // **** Para loguear el balance del atacante ****
    // await this.simpleToken.connect(attacker).transfer(user.address, 11);
    // const attackerBalance = await this.simpleToken.balanceOf(attacker.address);
    // console.log(attackerBalance.toString());
  });
});
