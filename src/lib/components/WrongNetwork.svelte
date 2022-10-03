<script lang="ts">
	import { networks } from "$lib/ethers/network";
	import { ethereumRequest, publicKey } from "$lib/store/ethers.store";
	import ConnectMetamaskBtn from "./ConnectMetamaskBtn.svelte";

	async function switchChain() {
		if (!$ethereumRequest) {
			console.error("no ethereum request class initiated");
			return;
		}
		await $ethereumRequest.switchChain(networks.mumbai.chainId);
	}
</script>

<div class="p-2 text-center">
	<h1
		class="font-extrabold text-5xl text-transparent bg-clip-text bg-gradient-to-tr from-red-300 to-red-600"
	>
		Wrong Network
	</h1>
	<h2 class="text-xl">
		Please switch to <span
			class="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-tr from-purple-300 to-purple-600"
			>Mumbai</span
		>
		testnet
	</h2>
	<div class="mt-8" />
	{#if $publicKey}
		<button
			class="relative inline-flex items-center justify-center p-1 mb-2 mr-2 overflow-hidden text-xl font-medium text-purple-600 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
			on:click={switchChain}
		>
			<span
				class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
			>
				Switch now
			</span>
		</button>
	{:else}
		<ConnectMetamaskBtn />
	{/if}
</div>
