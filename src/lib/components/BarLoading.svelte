<script lang="ts"></script>

<div class="dots-5" />

<style>
	.dots-5 {
		width: 10px;
		aspect-ratio: 1;
		border-radius: 50%;
		animation: d5 1s infinite linear alternate;
	}
	@keyframes d5 {
		0% {
			box-shadow: 20px 0 rgb(255, 255, 255), -20px 0 #fff2;
			background: #fff;
		}
		33% {
			box-shadow: 20px 0 rgb(255, 255, 255), -20px 0 #fff2;
			background: #fff2;
		}
		66% {
			box-shadow: 20px 0 rgba(255, 255, 255, 0.133), -20px 0 #fff;
			background: #fff2;
		}
		100% {
			box-shadow: 20px 0 rgba(255, 255, 255, 0.133), -20px 0 #fff;
			background: #fff;
		}
	}
</style>
