const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DoS", function () {
  let deployer, attacker, user;

  beforeEach(async function () {
    [deployer, attacker, user] = await ethers.getSigners();

    const Auction = await ethers.getContractFactory("Auction", deployer);
    this.auction = await Auction.deploy();

    this.auction.bid({ value: 100 }); // wei
  });

  describe("Auction", function () {
    describe("refundAll()", function () {
      it("Should refund the bidders that didn't win", async function () {
        await this.auction.connect(user).bid({ value: 150 });
        await this.auction.bid({ value: 200 });

        const userBalanceBefore = await ethers.provider.getBalance(
          user.address
        );
        await this.auction.refundAll();
        const userBalanceAfter = await ethers.provider.getBalance(user.address);

        expect(userBalanceAfter).to.eq(userBalanceBefore.add(150));
      });
      it("Should revert if the amount of computation hits the block gas limit", async function () {
        for (let i = 0; i < 1500; i++) {
          await this.auction.connect(attacker).bid({ value: 101 + i });
        }
        await expect(this.auction.refundAll()).to.be.reverted;
      });
    });
  });

  describe.skip("Pull over push solution", function () {
    it("A user should be able to be refunded", async function () {
      await this.auction.connect(user).bid({ value: 150 });

      await this.auction.bid({ value: 200 });

      const userBalanceBefore = await ethers.provider.getBalance(user.address);

      await this.auction.connect(user).withdrawRefund();

      const userBalanceAfter = await ethers.provider.getBalance(user.address);

      expect(userBalanceAfter).to.be.gt(userBalanceBefore);
    });
    it("A user should be able to be refunded even for a very large number of bids", async function () {
      for (let i = 0; i < 1500; i++) {
        await this.auction.connect(user).bid({ value: 101 + i });

        await this.auction.connect(user).withdrawRefund();
      }

      const userBalanceBefore = await ethers.provider.getBalance(user.address);

      await this.auction.connect(user).withdrawRefund();

      const userBalanceAfter = await ethers.provider.getBalance(user.address);

      expect(userBalanceAfter).to.be.gt(userBalanceBefore);
    });
  });
});
