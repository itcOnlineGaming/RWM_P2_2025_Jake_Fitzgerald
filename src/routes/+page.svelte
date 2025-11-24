<script lang="ts">
	import { goto } from "$app/navigation";
    //import { base } from '$app/paths';
    import { tasksCompletedStore } from '$lib/stores/tasks.js';
    import { get } from 'svelte/store';
    import './styles.css';

    import jigsaw_base from '$lib/images/jigsaw_original.jpg';
    import jigsaw_0 from '$lib/images/jigsaw_0.png';
    import jigsaw_1 from '$lib/images/jigsaw_1.png';
    import jigsaw_2 from '$lib/images/jigsaw_2.png';
    import jigsaw_complete from '$lib/images/jigsaw_complete.png';
    

    // Tasks completed
    let taskCount = 3;
    const { tasks_completed_number } = get(tasksCompletedStore);
    taskCount = tasks_completed_number;

    function OnClickNavigate()
    {
        console.log("Confirm Button Clicked");
        goto("/TasksScreen", {noScroll:false});
    }


</script>

<h1> Task - Jigsaw Abstraction</h1>

{#if taskCount === 0}
    <p>No tasks completed</p>
    <img src={jigsaw_base} alt="Jigsaw" width="200" />
{/if}

{#if taskCount === 1}
    <p>1 task completed</p>
    <img src={jigsaw_0} alt="Jigsaw" width="200" />
{/if}

{#if taskCount === 2}
    <p>2 tasks completed</p>
    <img src={jigsaw_1} alt="Jigsaw" width="200" />
{/if}

{#if taskCount === 3}
    <p>3 tasks completed</p>
    <img src={jigsaw_2} alt="Jigsaw" width="200" />
{/if}

{#if taskCount === 4}
    <p>All tasks completed</p>
    <img src={jigsaw_complete} alt="Jigsaw" width="200" />
{/if}




<div class="container">
	<slot />
	<div class="edit-bt">
		<button
			class="save-btn"
			on:click={() => goto("/TasksScreen")}>
			TASKS
		</button>
	</div>
</div>

