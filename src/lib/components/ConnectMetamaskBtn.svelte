<script lang="ts">
	import { ethereumRequest } from "$lib/store/ethers.store";
	import MetamaskBtn from "./MetamaskBtn.svelte";

	async function connectToMetamask() {
		console.log("click");
		if (!$ethereumRequest) {
			console.log("no ethereum request initiated");
			return;
		}
		await $ethereumRequest.connectMetamask();
	}
</script>

<MetamaskBtn onClick={connectToMetamask} />
