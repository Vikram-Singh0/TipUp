import { expect } from "chai";
import { ethers } from "ethers";
import { artifacts } from "hardhat";

describe("TipUp Contract", function () {
  let tipUp: any;
  let owner: any;
  let creator: any;
  let supporter: any;
  let provider: ethers.Provider;

  beforeEach(async function () {
    // Create test provider (Hardhat node)
    provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    
    // Create test wallets with valid private keys
    owner = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    creator = new ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", provider);
    supporter = new ethers.Wallet("0x5de4111aaeba71588ca7f3c0e0e5c2c3b2e3b5e6c7d8e9f0a1b2c3d4e5f6a7b8", provider);

    // Load contract artifact and deploy
    const artifact = await artifacts.readArtifact("TipUp");
    const TipUpFactory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, owner);
    
    tipUp = await TipUpFactory.deploy();
    await tipUp.waitForDeployment();
  });

  describe("Creator Registration", function () {
    it("Should allow a user to register as a creator", async function () {
      const ensName = "creator.eth";
      const profileMessage = "I create amazing content!";

      await expect(tipUp.connect(creator).registerCreator(ensName, profileMessage))
        .to.emit(tipUp, "CreatorRegistered")
        .withArgs(ensName, creator.address, profileMessage);

      const creatorData = await tipUp.getCreator(ensName);
      expect(creatorData.wallet).to.equal(creator.address);
      expect(creatorData.ensName).to.equal(ensName);
      expect(creatorData.profileMessage).to.equal(profileMessage);
      expect(creatorData.isRegistered).to.be.true;
    });

    it("Should not allow duplicate ENS names", async function () {
      const ensName = "creator.eth";
      const profileMessage = "I create amazing content!";

      await tipUp.connect(creator).registerCreator(ensName, profileMessage);

      await expect(
        tipUp.connect(supporter).registerCreator(ensName, "Another message")
      ).to.be.revertedWith("ENS already registered");
    });

    it("Should not allow empty ENS name", async function () {
      const profileMessage = "I create amazing content!";

      await expect(
        tipUp.connect(creator).registerCreator("", profileMessage)
      ).to.be.revertedWith("ENS name cannot be empty");
    });
  });

  describe("Tipping", function () {
    beforeEach(async function () {
      const ensName = "creator.eth";
      const profileMessage = "I create amazing content!";
      await tipUp.connect(creator).registerCreator(ensName, profileMessage);
    });

    it("Should allow tipping a registered creator", async function () {
      const ensName = "creator.eth";
      const tipAmount = ethers.parseEther("0.1");
      const tipMessage = "Great content!";

      await expect(
        tipUp.connect(supporter).tip(ensName, tipMessage, {
          value: tipAmount,
        })
      ).to.emit(tipUp, "TipSent");

      const creatorData = await tipUp.getCreator(ensName);
      expect(creatorData.totalTips).to.equal(tipAmount);
      expect(creatorData.tipCount).to.equal(1);
    });

    it("Should not allow tipping unregistered creators", async function () {
      const ensName = "unregistered.eth";
      const tipAmount = ethers.parseEther("0.1");
      const tipMessage = "Great content!";

      await expect(
        tipUp.connect(supporter).tip(ensName, tipMessage, {
          value: tipAmount,
        })
      ).to.be.revertedWith("Creator not registered");
    });

    it("Should not allow zero amount tips", async function () {
      const ensName = "creator.eth";
      const tipAmount = 0;
      const tipMessage = "Great content!";

      await expect(
        tipUp.connect(supporter).tip(ensName, tipMessage, {
          value: tipAmount,
        })
      ).to.be.revertedWith("Tip amount must be greater than 0");
    });
  });

  describe("Contract Statistics", function () {
    it("Should return correct contract stats", async function () {
      const stats = await tipUp.getContractStats();
      expect(stats[0]).to.equal(0); // totalTipsSent
      expect(stats[1]).to.equal(0); // totalCreators
      expect(stats[2]).to.equal(0); // contract balance
    });

    it("Should update stats after creator registration", async function () {
      const ensName = "creator.eth";
      const profileMessage = "I create amazing content!";

      await tipUp.connect(creator).registerCreator(ensName, profileMessage);

      const stats = await tipUp.getContractStats();
      expect(stats[1]).to.equal(1); // totalCreators should be 1
    });

    it("Should update stats after tipping", async function () {
      const ensName = "creator.eth";
      const profileMessage = "I create amazing content!";
      const tipAmount = ethers.parseEther("0.1");

      await tipUp.connect(creator).registerCreator(ensName, profileMessage);
      await tipUp.connect(supporter).tip(ensName, "Great content!", {
        value: tipAmount,
      });

      const stats = await tipUp.getContractStats();
      expect(stats[0]).to.equal(1); // totalTipsSent should be 1
    });
  });
});