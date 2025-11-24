<script lang="ts">
    import { tasksStore } from '$lib/stores/tasks.js';

    type Task = {
        id: number;
        text: string;
        completed: boolean;
    };

    let tasks: Task[] = $state([]);
    let newTaskText = $state('');

    // Subscribe to the store
    tasksStore.subscribe(value => {
        tasks = value;
    });

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

</script>

<h1 class="title">Tasks Checklist</h1>

<!-- Task List Section -->
<section class="section task-list-section">
    <h2>Current Tasks</h2>
    <div class="task-list">
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
            </div>
        {/each}
    </div>
</section>

