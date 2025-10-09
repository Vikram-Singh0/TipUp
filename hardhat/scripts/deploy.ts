import "dotenv/config";
import fs from "fs";
import path from "path";
import hre, { artifacts } from "hardhat";
import { ethers } from "ethers";

async function main() {
  console.log("Deploying TipUp contract...");
  
  try {
    // Load the artifact
    const artifact = await artifacts.readArtifact("TipUp");
    
    // Resolve network name and configuration
    const networkName: string = (hre as any)?.network?.name || process.env.HARDHAT_NETWORK || "hardhat";
    const netCfgAll: any = (hre as any)?.config?.networks || {};
    const resolvedNetCfg: any = netCfgAll[networkName] || netCfgAll["pushTestnet"] || {};

    // Build provider and signer from the selected network configuration
    const configuredUrlAny: any = resolvedNetCfg ? (resolvedNetCfg as any).url : undefined;
    let rpcUrl: string | undefined = undefined;
    if (typeof configuredUrlAny === "string") {
      rpcUrl = configuredUrlAny;
    } else if (configuredUrlAny && typeof configuredUrlAny.url === "string") {
      rpcUrl = configuredUrlAny.url;
    } else {
      rpcUrl = process.env.PUSH_TESTNET_RPC_URL || process.env.PUSH_TESTNET_RPC || process.env.RPC_URL;
    }
    // Resolve private key from config or env, in a robust way
    const pickFirst = (val: any): any => (Array.isArray(val) ? val[0] : val);
    const coerceToString = (val: any): string | undefined => {
      if (val == null) return undefined;
      if (typeof val === "string") return val;
      if (typeof val === "object") {
        // Some configs may wrap the value or expose as { privateKey: "..." }
        if (typeof (val as any).privateKey === "string") return (val as any).privateKey;
        // Hardhat keystore/configVariable may proxy the value; attempt to stringify
        try { return String(val); } catch { return undefined; }
      }
      try { return String(val); } catch { return undefined; }
    };
    const looksLikeHex = (s: string) => /^0x[0-9a-fA-F]{64}$/.test(s) || /^[0-9a-fA-F]{64}$/.test(s);
    // Prefer explicit env over configVariable objects
    let privateKeyStr = coerceToString(process.env.PRIVATE_KEY);
    if (!privateKeyStr || !looksLikeHex(privateKeyStr.startsWith("0x") ? privateKeyStr : `0x${privateKeyStr}`)) {
      const pkFromCfg = coerceToString(pickFirst(resolvedNetCfg?.accounts));
      if (pkFromCfg && looksLikeHex(pkFromCfg.startsWith("0x") ? pkFromCfg : `0x${pkFromCfg}`)) {
        privateKeyStr = pkFromCfg;
      }
    }

    if (!rpcUrl) {
      throw new Error(`RPC URL not found. Provide networks.${networkName}.url in hardhat.config.ts or set PUSH_TESTNET_RPC/RPC_URL env.`);
    }
    if (!privateKeyStr) {
      throw new Error(`Deployer private key not found. Configure networks.${networkName}.accounts or set PRIVATE_KEY env.`);
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl as string);
    const trimmedPk = privateKeyStr.trim();
    const normalizedPk = trimmedPk.startsWith("0x") ? trimmedPk : (`0x${trimmedPk}` as string);
    if (!/^0x[0-9a-fA-F]{64}$/.test(normalizedPk)) {
      throw new Error(
        `Invalid PRIVATE_KEY provided. Expected 32-byte hex string; got: ${normalizedPk.substring(0,10)}...`
      );
    }
    const deployer = new ethers.Wallet(normalizedPk, provider);
    console.log("Network:", networkName);
    console.log("Using RPC:", rpcUrl);
    console.log("Deployer:", await deployer.getAddress());
    const TipUp = new ethers.ContractFactory(artifact.abi, artifact.bytecode, deployer);
    
    // Deploy the contract
    const tipUp = await TipUp.deploy();
    
    // Wait for deployment to complete
    await tipUp.waitForDeployment();
    
    const contractAddress = await tipUp.getAddress();
    
    console.log("✅ TipUp contract deployed successfully!");
    console.log("Contract address:", contractAddress);
    
    // Verify deployment by calling a view function
    const stats = await (tipUp as any).getContractStats();
    
    console.log("\n📊 Initial Contract Stats:");
    console.log("Total tips sent:", stats[0].toString());
    console.log("Total creators:", stats[1].toString());
    console.log("Contract balance:", ethers.formatEther(stats[2]), "ETH");
    
    console.log("\n🔗 Contract Details:");
    console.log("Use this address in your frontend .env file:");
    console.log(`NEXT_PUBLIC_TIPUP_CONTRACT=${contractAddress}`);
    
    // Save deployment info to a file
    const networkInfo = await provider.getNetwork();
    const deploymentInfo = {
      contractAddress,
      network: networkName,
      chainId: Number(networkInfo.chainId),
      deploymentTime: new Date().toISOString(),
      contractName: "TipUp",
    };
    
    fs.writeFileSync(
      'deployment-info.json', 
      JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log("\n💾 Deployment info saved to deployment-info.json");
    
    // Copy ABI to frontend for ease of integration
    const artifactPath = path.join(
      hre.config.paths.artifacts,
      "contracts",
      "TipUp.sol",
      "TipUp.json"
    );
    const frontendAbiPath = path.resolve(
      process.cwd(),
      "..",
      "app",
      "src",
      "lib",
      "TipUp.json"
    );
    try {
      fs.mkdirSync(path.dirname(frontendAbiPath), { recursive: true });
      fs.copyFileSync(artifactPath, frontendAbiPath);
      console.log("✅ ABI copied to frontend at:", frontendAbiPath);
    } catch (copyErr) {
      console.warn("⚠️ Failed to copy ABI to frontend:", copyErr);
    }
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });