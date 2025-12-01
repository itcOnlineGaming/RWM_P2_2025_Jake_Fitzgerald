<script lang="ts">
	import { goto } from "$app/navigation";
    //import { base } from '$app/paths';
    import { tasksStore, tasksCompletedStore } from '$lib/stores/tasks.js';
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
    const tasks = get(tasksStore);
    const completedTasks = tasks.filter(t => t.completed);
    
    // Difficulty
    type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'GREY';
    const difficultyColours: Record<Difficulty, string> = {
	EASY: "#4CAF50",
	MEDIUM: "#FFC107",
	HARD: "#F44336",
	GREY: "#9E9E9E"
    };

    // Local task list we can reference
    interface Task 
    {
        id: number;
        text: string;
        completed: boolean;
        difficulty: string; // Still string because store is untyped
    }
        

    function getTaskColour(task: Task): string 
    {
        if (!task.completed) 
        {
            return "#9E9E9E"; // Grey if not completed
        }
        return getDifficultyColour(task.difficulty);
    }

    function getDifficultyColour(difficulty: string): string 
    {
        // Narrow the string to the known difficulty keys
        if (difficulty in difficultyColours) 
        {
            return difficultyColours[difficulty as Difficulty];
        }
        return '#ccc'; // Pick grey otherwise
    }

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


<div class="rectangle-wrapper">
    {#each tasks as task}
        <div class="tooltip-container">
            <div 
                class="rectangle"
                style="background-color: {getTaskColour(task)}">
            </div>

            <span class="tooltip-text">
                <strong>{task.text}</strong><br />
                Status: 
                <span class="{task.completed ? 'status-completed' : 'status-incomplete'}">
                    {task.completed ? 'Completed' : 'Not completed'}
                </span>
            </span>
        </div>
    {/each}
</div>

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

<style>


.rectangle 
{
    width: 120px;
    height: 60px;
    border-radius: 8px;
    box-shadow: 0px 3px 8px rgba(0,0,0,0.2);

    /* Animation */
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.rectangle:hover 
{
    transform: scale(1.15);      /* Grow by 15% */
    box-shadow: 0px 6px 16px rgba(0,0,0,0.3);  /* Stronger shadow when enlarged */
}
.rectangle-wrapper 
{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;

    /* Center in screen */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.tooltip-container 
{
    position: relative;
    display: inline-block;
}

.tooltip-text 
{
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s;
    position: absolute;
    bottom: 110%; /* position above the rectangle */
    left: 50%;
    transform: translateX(-50%);
    padding: 6px 10px;
    border-radius: 6px;
    background-color: #333;
    color: white;
    font-size: 0.85rem;
    white-space: nowrap;
    z-index: 10;
}

.rectangle:hover + .tooltip-text 
{
    visibility: visible;
    opacity: 1;
}

.status-completed 
{
    color: #4CAF50;
    font-weight: bold;
}

.status-incomplete 
{
    color: #F44336;
    font-weight: bold;
}
</style>