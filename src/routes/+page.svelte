<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import logo from "$lib/images/deprotect_logo.svg";
	import usdt_logo from "$lib/images/tether-usdt-logo.svg";
	import { getProvider, getSigner } from "$lib/ethers/eth";
	import { numberToCoin } from "@deprotect/smart-contracts";
	import BarLoading from "$lib/components/BarLoading.svelte";
	import { EthereumEvent, type TEthereumEvent } from "$lib/ethers/ethereum";
	import WrongNetwork from "$lib/components/WrongNetwork.svelte";
	import {
		externalProvider_w,
		network_w,
		provider_w,
		signer_w,
		chainId,
		chainIdHex,
		publicKey,
		usdtContract,
		ethereumRequest
	} from "$lib/store/ethers.store";
	import MetamaskBtn from "$lib/components/MetamaskBtn.svelte";
	import ConnectMetamaskBtn from "$lib/components/ConnectMetamaskBtn.svelte";

	let accountChangeEthereum: EthereumEvent<"accountsChanged"> | undefined = undefined;
	let chainChangeEthereum: EthereumEvent<"chainChanged"> | undefined = undefined;

	const accountChangeHandler: TEthereumEvent["accountsChanged"] = async (accounts) => {
		if ($provider_w) {
			const newSigner = $provider_w.getSigner();
			signer_w.set(newSigner);
		}
	};

	const chainChangedHandler: TEthereumEvent["chainChanged"] = async (chainId) => {
		console.log("new chain id", chainId);
		if (window) {
			window.location.reload();
		}
	};

	onMount(async () => {
		console.log("on mount");
		const providersObj = await getProvider();
		if (providersObj) {
			externalProvider_w.set(providersObj.externalProvider);
			provider_w.set(providersObj.web3Provider);
			const signer = getSigner(providersObj.web3Provider);
			signer_w.set(signer);
			const network = await providersObj.web3Provider.getNetwork();
			network_w.set(network);

			accountChangeEthereum = new EthereumEvent(
				providersObj.externalProvider,
				"accountsChanged",
				accountChangeHandler
			);
			accountChangeEthereum.listen();

			chainChangeEthereum = new EthereumEvent(
				providersObj.externalProvider,
				"chainChanged",
				chainChangedHandler
			);
			chainChangeEthereum.listen();
		}
	});

	onDestroy(async () => {
		if (accountChangeEthereum) {
			accountChangeEthereum.removeListener();
		}

		if (chainChangeEthereum) {
			chainChangeEthereum.removeListener();
		}
	});

	$: isWrongChain = $chainId !== 80001;

	// async function connectWallet() {
	// 	if ($provider_w) {
	// 		const addresses = await connectMetamask($provider_w);
	// 		console.log(addresses);
	// 		const signer = $provider_w.getSigner();
	// 		signer_w.set(signer);
	// 		const network = await $provider_w.getNetwork();
	// 		console.log("chainId", $chainId);
	// 	}
	// }

	let amount: number;

	let isSubmitting = false;
	async function onClicnSubmit() {
		console.log(`public key`, $publicKey);
		console.log("usdtContract", $usdtContract?.contract.address);
		if ($publicKey && $usdtContract) {
			try {
				isSubmitting = true;
				const amountBN = numberToCoin(amount);
				const tx = await $usdtContract.contract.mint($publicKey, amountBN);
				await tx.wait();
				alert(`minted hash: ${tx.hash}`);
			} catch (error) {
				console.log(error);
			} finally {
				isSubmitting = false;
				amount = 0;
				return;
			}
		}
		alert("Please connect Metamask");
	}

	async function addUSDTTokenToMetamask() {
		if ($usdtContract && $ethereumRequest) {
			// const wasAdded = addTokenToWallet(
			// 	$usdtContract.contract.address,
			// 	"USDT",
			// 	18,
			// 	"https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
			// 	"ERC20"
			// );
			$ethereumRequest.watchAssets(
				$usdtContract.contract.address,
				"USDT",
				18,
				"https://s2.coinmarketcap.com/static/img/coins/64x64/825.png"
			);
			return;
		}
		alert(`Not found USDT contract`);
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="DeProtect USDT Faucet" />
</svelte:head>

<section class="bg h-[100vh] w-[100vw]">
	<div class="flex flex-col items-center pt-[16px] justify-start">
		<div class="flex flex-row justify-between mb-8 iphone:w-[370px] ipad:w-[640px]">
			<img src={logo} alt="logo" />
			{#if $publicKey != null}
				<MetamaskBtn buttonText={$publicKey.slice(0, 10)} />
			{:else}
				<ConnectMetamaskBtn />
			{/if}
		</div>
		<div
			class="bg-white/60  backdrop-blur-lg drop-shadow-lg rounded-md py-12 iphone:min-w-[370px] ipad:min-w-[640px]"
		>
			{#if !isWrongChain}
				<div>
					<div class="flex flex-row justify-center gap-3">
						<img src={usdt_logo} alt="usdt logo" width="45" height="45" class="animate-bounce" />
						<h1
							class="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-bl from-emerald-200 to-[#47a48a]"
						>
							USDT Faucet
						</h1>
					</div>
					<form class="p-4 " on:submit|preventDefault>
						<div>
							<label for="address" class="text-gray-500">Address</label>
							<input
								type="text"
								id="address"
								class="rounded-lg border-blue-200 focus:border-blue-500 w-full text-gray-500"
								value={$publicKey ?? "Metamask not connected"}
								disabled
							/>
						</div>
						<div class="my-4" />
						<div>
							<label for="amount" class="text-gray-500">Amount</label>
							<input
								type="number"
								id="amount"
								class="rounded-lg border-blue-200 focus:border-blue-500 w-full"
								bind:value={amount}
							/>
						</div>
						<div class="w-full flex justify-center pt-4">
							<button
								type="button"
								class="rounded-md border-2 px-4 py-2 bg-blue-500 text-white w-[150px]"
								on:click={onClicnSubmit}
							>
								{#if !isSubmitting}
									<span>Sent to me</span>
								{:else}
									<span class="flex justify-center p-2">
										<BarLoading />
									</span>
								{/if}
							</button>
						</div>
					</form>
					<div class="p-4 flex flex-col gap-2 justify-center ">
						<button
							class="px-4 py-2 text-white rounded-lg bg-gradient-to-b from-emerald-400 to-[#47a48a]"
							on:click={addUSDTTokenToMetamask}>Watch my USDT on Metamask</button
						>
						<a href="/about">go to about</a>
					</div>
				</div>
			{:else}
				<WrongNetwork />
			{/if}
		</div>
	</div>
</section>

<style>
	.bg {
		background: rgb(61, 163, 233);
		background: linear-gradient(0deg, rgba(61, 163, 233, 1) 0%, rgba(175, 220, 237, 1) 100%);
	}
</style>
