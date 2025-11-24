<script lang="ts">
	import { goto } from "$app/navigation";
	import { base } from "$app/paths";
	
</script>

<div class="container">
	<slot />

	<!-- Common Action Buttons for all TasksScreen pages -->
	<div class="action-buttons">
		<button onclick={() => goto(`${base}/`)} class="save-btn">
			SAVE
		</button>
		<button onclick={() => goto(`${base}/`)} class="cancel-btn">
			RETURN
		</button>
	</div>
</div>

<style>
	/* Common container and styling */
	.container 
	{
		max-width: 200px;
		margin: 0 auto;
		padding: 10px;
		font-family: Arial, sans-serif;
		min-height: 100vh;
		position: relative;
	}

	.container::before 
	{
		content: "";
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, #97aac7 0%, #6883ad 100%);
		z-index: -1;
	}

	/* Common button styles */
	.action-buttons 
	{
		display: flex;
		gap: 10px;
		justify-content: center;
		margin-top: 20px;
	}

	.save-btn 
	{
		background: linear-gradient(180deg, #abaceb 0%, #818cf8 100%);
		color: white;
		border: none;
		padding: 15px 25px;
		border-radius: 8px;
		cursor: pointer;
		font-weight: bold;
		font-size: 14px;
		transition: transform 0.2s;
	}

	.save-btn:hover {
		transform: translateY(-2px);
	}

	.cancel-btn {
		background: #6c757d;
		color: white;
		border: none;
		padding: 15px 25px;
		border-radius: 8px;
		cursor: pointer;
		font-weight: bold;
		font-size: 14px;
		transition: transform 0.2s;
	}

	.cancel-btn:hover {
		transform: translateY(-2px);
		background: #5a6268;
	}

	/* Common section styles */
	:global(.section) {
		border-radius: 15px;
		padding: 20px;
		margin-bottom: 20px;
	}

	:global(.section h2) {
		margin: 0 0 15px 0;
		font-size: 18px;
		font-weight: bold;
	}

	:global(.title) {
		text-align: center;
		color: #333;
		margin-bottom: 30px;
		font-size: 24px;
		font-weight: bold;
	}
</style>
