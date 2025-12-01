<script lang="ts">
    import { tasksStore } from '$lib/stores/tasks.js'; 
    import { tasksCompletedStore } from '$lib/stores/tasks.js';

    // Number we store for the Abstract Calendar page
    let task_count = 0;

    type Task = 
    {
        id: number;
        text: string;
        completed: boolean;
        difficulty: string;
    };

    let tasks: Task[] = $state([]);
    let newTaskText = $state('');

    // Difficulty levels for buttons
    const difficulties = ['EASY', 'MEDIUM', 'HARD'];

    // Subscribe to the store
    tasksStore.subscribe(value => {
        tasks = value;
    });

    function updateTaskCount()
    {
        // Get each task and check if they have been checked or not
        $derived: task_count = tasks.filter(t => t.completed).length;
        console.log("Tasks completed number:", task_count);

        // Store the task count
        tasksCompletedStore.set({
        tasks_completed_number: task_count});
    }


    function toggleTask(id: number) 
    {
        const updatedTasks = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        tasksStore.set(updatedTasks);
    }

    function updateTaskText(id: number, newText: string) 
    {
        const updatedTasks = tasks.map(task => 
            task.id === id ? { ...task, text: newText } : task
        );
        tasksStore.set(updatedTasks);
    }

    function setTaskDifficulty(id: number, difficulty: string) 
    {
        const updatedTasks = tasks.map(task => 
            task.id === id ? { ...task, difficulty } : task
        );
        tasksStore.set(updatedTasks);
    }

    function difficultyColour(level: string, isSelected: boolean) 
    {
        if (isSelected) 
        {
            // Bright colour for the button selected
            switch(level) 
            {
                case 'EASY': return 'green';
                case 'MEDIUM': return 'orange';
                case 'HARD': return 'red';
            }
        } 
        else 
        {
            // Faded colour otherwise
            return '#ccc';
        }
    }

</script>

<h1 class="title">Tasks Checklist</h1>

<p1>task_count</p1>

<section class="task-list-section">
    {#each tasks as task (task.id)}
        <div class="task-item">
            <input 
                type="text" 
                value={task.text}
                oninput={(e) => updateTaskText(task.id, (e.target as HTMLInputElement).value)}
                class="task-text-input"
                class:completed={task.completed}
            />
            <input 
                type="checkbox" 
                checked={task.completed}
                onchange={() => toggleTask(task.id)}
                class="task-checkbox"
            />

            <div class="difficulty-buttons">
                {#each difficulties as level}
                    <button
                        class:selected={task.difficulty === level}
                        onclick={() => setTaskDifficulty(task.id, level)}
                        style="background-color: {difficultyColour(level, task.difficulty === level)};"
                    >
                        {level}
                    </button>
                {/each}
            </div>
        </div>
    {/each}
</section>

<style>
    .task-item {
        margin-bottom: 1rem;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .task-text-input.completed {
        text-decoration: line-through;
    }

    .difficulty-buttons {
        margin-top: 0.5rem;
    }

    .difficulty-buttons button {
        margin-right: 0.5rem;
        padding: 0.3rem 0.6rem;
        border: none;
        border-radius: 4px;
        color: white;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s, transform 0.1s;
    }

    .difficulty-buttons button:hover {
        opacity: 0.9;
        transform: scale(1.05);
    }

    .difficulty-buttons button.selected {
        box-shadow: 0 0 5px #00000050;
        opacity: 1;
    }
</style>