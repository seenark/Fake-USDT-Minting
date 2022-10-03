import { EthereumRequest } from "$lib/ethers/ethereum-request";
import { getAllContracts, type EContractName, type TetherUSD } from "@deprotect/smart-contracts";
import { utils, type providers, type Signer } from "ethers";
import { derived, writable } from "svelte/store";

export const externalProvider_w = writable<providers.ExternalProvider | null>(null);
export const provider_w = writable<providers.Web3Provider | null>(null);
export const signer_w = writable<Signer | null>(null);
export const network_w = writable<providers.Network | null>(null);

export const publicKey = derived<typeof signer_w, string | null>(signer_w, ($signer, set) => {
	(async () => {
		if (!$signer) {
			set(null);
			return;
		}
		try {
			const address = await $signer.getAddress();
			set(address);
		} catch (error) {
			set(null);
		}
	})();
});

export const usdtContract = derived<
	typeof signer_w,
	{ contract: TetherUSD; name: EContractName } | null
>(signer_w, ($signer, set) => {
	(async () => {
		if (!$signer) {
			set(null);
			return;
		}
		const allContacts = await getAllContracts($signer, "mumbai");
		console.log("setup all contracts", allContacts);
		set(allContacts.USDTContract);
	})();
});

export const chainId = derived([network_w], ([$network]) => {
	if ($network) {
		return $network.chainId;
	} else {
		return 0;
	}
});

export const chainIdHex = derived(chainId, ($chainId) => {
	return utils.hexValue($chainId);
});

export const ethereumRequest = derived(
	[provider_w, externalProvider_w],
	([$provider, $exProvider]) => {
		if (!$exProvider || !$provider) {
			return null;
		}
		const ethereumReq = new EthereumRequest($provider, $exProvider);
		return ethereumReq;
	}
);
