const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Access Control", () => {
  let deployer, attacker, user;

  beforeEach(async function () {
    [deployer, attacker, user] = await ethers.getSigners();

    const Storage = await ethers.getContractFactory("Storage", deployer);
    this.storage = await Storage.deploy();
  });

  describe("Storage", () => {
    it("Should set the deployer account as the owner at deployment", async function () {
      expect(await this.storage.owner()).to.eq(deployer.address);
    });

    it("An authorized user can set number", async function () {
      await this.storage.store(500);
      expect(await this.storage.retrieve()).to.eq(500);
    });

    it("An unauthorized user can't set number", async function () {
      await expect(
        this.storage.connect(attacker).store(666)
      ).to.be.revertedWith("Not Authorized");
    });
  });
});
