import { providers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";

// interface ConnectInfo {
// 	chainId: string;
// }

// interface ProviderMessage {
// 	type: string;
// 	data: unknown;
// }

export async function getProvider() {
	const provider = (await detectEthereumProvider()) as providers.ExternalProvider;
	if (provider) {
		const web3Provider = new providers.Web3Provider(provider);
		return {
			web3Provider,
			externalProvider: provider
		};
	} else {
		console.warn("Not found provider");
	}
}

export async function connectMetamask(provider: providers.Web3Provider) {
	const addresses: string[] = await provider.send("eth_requestAccounts", []);
	return addresses;
}

export function getSigner(provider: providers.Web3Provider) {
	const signer = provider.getSigner();
	return signer;
}

export async function isMetamaskUnlocked() {
	return await (window as any).ethereum._metamask.isUnlocked();
}

export async function addTokenToWallet(
	address: string,
	symbol: string,
	decimal: number,
	tokenLogoUrl = "",
	type: "ERC20" | "ERC721" = "ERC20"
) {
	const { ethereum } = window as any;
	const wasAdded: boolean = ethereum.request({
		method: "wallet_watchAsset",
		params: {
			type: type, // Initially only supports ERC20, but eventually more!
			options: {
				address: address, // The address that the token is at.
				symbol: symbol, // A ticker symbol or shorthand, up to 5 chars.
				decimals: decimal, // The number of decimals in the token
				image: tokenLogoUrl // A string url of the token logo
			}
		}
	});

	if (wasAdded) {
		console.log("Thanks for your interest!");
	} else {
		console.log("Add error");
	}
}
