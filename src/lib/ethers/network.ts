import { utils } from "ethers";
import type { AddEthereumChainParameter } from "./metamask.type";

const mumbai: AddEthereumChainParameter = {
	chainId: utils.hexValue(80001),
	chainName: "Mumbai",
	nativeCurrency: {
		decimals: 18,
		name: "MATIC",
		symbol: "MATIC"
	},
	rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
	blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
	iconUrls: ["https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png"]
};

export const networks = {
	mumbai
};
