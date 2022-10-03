import type { providers } from "ethers";
import type { AddEthereumChainParameter, WatchAssetParams } from "./metamask.type";
import { networks } from "./network";

type TWalletMethod =
	| "eth_requestAccounts"
	| "wallet_addEthereumChain"
	| "wallet_switchEthereumChain"
	| "wallet_watchAsset"
	| "wallet_scanQRCode";

enum EWalletMethod {
	addEthereumChain = "wallet_addEthereumChain",
	switchEthereumChain = "wallet_switchEthereumChain"
}

export class EthereumRequest {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	ethereum: any;
	constructor(private provider: providers.Web3Provider, ethereum: providers.ExternalProvider) {
		this.ethereum = ethereum;
	}

	async switchChain(chainIdHex: string) {
		const method = "wallet_switchEthereumChain";
		const params = [{ chainId: chainIdHex }];
		try {
			await this.provider.send(method, params);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.log("switch error", error);
			if (error.code === 4902) {
				try {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					for (const [key, value] of Object.entries(networks)) {
						if (value.chainId === chainIdHex) {
							await this.addChain(value);
						}
					}
				} catch (error) {
					console.log(error);
				}
			}
			console.log(error);
		}
	}

	async addChain(params: AddEthereumChainParameter) {
		try {
			await this.provider.send(EWalletMethod.addEthereumChain, [params]);
		} catch (error) {
			console.log("add chain error", error);
		}
	}

	isConnected(): boolean {
		return this.ethereum.isConnected() as boolean;
	}
	async connectMetamask() {
		try {
			const addresses: string[] = await this.provider.send("eth_requestAccounts", []);
			return addresses;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			if (error.code === 4001) {
				// EIP-1193 userRejectedRequest error
				throw new Error("User Rejected to connect");
				console.log("Please connect to MetaMask.");
			} else {
				console.error(error);
			}
		}
	}

	async watchAssets(address: string, symbol: string, decimal: number, tokenLogoUrl = "") {
		const method = "wallet_watchAsset";
		const params: WatchAssetParams = {
			type: "ERC20",
			options: {
				address: address,
				symbol: symbol,
				decimals: decimal,
				image: tokenLogoUrl
			}
		};
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const wasAdded: boolean = await this.provider.send(method, params as any);
		return wasAdded;
	}

	async isMetamaskUnlocked() {
		return await this.ethereum._metamask.isUnlocked();
	}
}
