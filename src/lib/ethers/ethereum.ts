import type { ethers, providers } from "ethers";

export interface IProviderChainChange extends ethers.providers.ExternalProvider {
	on: (method: "chainChanged", callback: (chainId: string) => void) => void;
	removeListener: (method: "chainChanged", callback: (chainId: string) => void) => void;
}

export interface IProviderAccountsChanged extends ethers.providers.ExternalProvider {
	on: (method: "accountsChanged", callback: (accounts: string[]) => void) => void;
	removeListener: (method: "accountsChanged", callback: (accounts: string[]) => void) => void;
}

export type TEthereumEvent = {
	chainChanged: TChainChangedHandleEvent;
	accountsChanged: TAccountsChangedHandleEvent;
};
type TChainChangedHandleEvent = (chainId: number) => void;
type TAccountsChangedHandleEvent = (accounts: string[]) => void;

type TEthereumEventName = "chainChanged" | "accountsChanged";
type TEthereumEventHandler<T extends TEthereumEventName> = T extends "chainChanged"
	? TChainChangedHandleEvent
	: T extends "accountsChanged"
	? TAccountsChangedHandleEvent
	: never;

export class EthereumEvent<T extends TEthereumEventName> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	ethereum: any;
	constructor(
		private provider: providers.ExternalProvider,
		private event: T,
		private handleEvent: TEthereumEventHandler<T>
	) {
		this.ethereum = provider;
	}
	// TODO: try to change etheruem to web3 provider
	listen() {
		console.log("listen on event:", this.event);
		this.ethereum.on(this.event, this.handleEvent);
	}

	removeListener() {
		this.ethereum.removeListener(this.event, this.handleEvent);
		console.log("remove event:", this.event);
	}
}
