const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Reentrancy", function () {
  let deployer, user, attacker;

  beforeEach(async function () {
    [deployer, user, attacker] = await ethers.getSigners();

    const SavingsAccountV3 = await ethers.getContractFactory(
      "SavingsAccountV3",
      deployer
    );
    this.savingsAccountV3 = await SavingsAccountV3.deploy();

    await this.savingsAccountV3.deposit({
      value: ethers.utils.parseEther("100"),
    });
    await this.savingsAccountV3
      .connect(user)
      .deposit({ value: ethers.utils.parseEther("50") });

    const InvestorV2 = await ethers.getContractFactory("InvestorV3", attacker);
    this.investorV2 = await InvestorV2.deploy(this.savingsAccountV3.address);
  });

  describe("savingsAccountV3", function () {
    // it("Should accept deposits", async function () {
    //   const deployerBalance = await this.savingsAccountV3.balanceOf(deployer.address);
    //   expect(deployerBalance).to.eq(ethers.utils.parseEther("100"));

    //   const userBalance = await this.savingsAccountV3.balanceOf(user.address);
    //   expect(userBalance).to.eq(ethers.utils.parseEther("50"));
    // });

    // it("Should accept withdrawals", async function () {
    //   await this.savingsAccountV3.withdraw();

    //   const deployerBalance = await this.savingsAccountV3.balanceOf(deployer.address);
    //   const userBalance = await this.savingsAccountV3.balanceOf(user.address);

    //   expect(deployerBalance).to.eq(0);
    //   expect(userBalance).to.eq(ethers.utils.parseEther("50"));
    // });

    it("InvestorV2 Attack", async function () {
      // console.log("");
      // console.log("*** Before ***");
      // console.log(
      //   `savingsAccountV3's balance: ${ethers.utils
      //     .formatEther(
      //       await ethers.provider.getBalance(this.savingsAccountV3.address)
      //     )
      //     .toString()}`
      // );
      // console.log(
      //   `Attackers's balance: ${ethers.utils
      //     .formatEther(await ethers.provider.getBalance(attacker.address))
      //     .toString()}`
      // );

      await this.investorV2.attack({ value: ethers.utils.parseEther("10") });

      // console.log("");
      // console.log("*** After ***");
      // console.log(
      //   `savingsAccountV3's balance: ${ethers.utils
      //     .formatEther(
      //       await ethers.provider.getBalance(this.savingsAccountV3.address)
      //     )
      //     .toString()}`
      // );
      // console.log(
      //   `Attackers's balance: ${ethers.utils
      //     .formatEther(await ethers.provider.getBalance(attacker.address))
      //     .toString()}`
      // );
      // console.log("");

      expect(
        await ethers.provider.getBalance(this.savingsAccountV3.address)
      ).to.eq(0);
    });
  });
});
