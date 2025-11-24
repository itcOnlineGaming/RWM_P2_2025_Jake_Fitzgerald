import { writable } from 'svelte/store';

// Initialize with default tasks
const defaultTasks = 
[
    { id: 1, text: 'Complete Graph', completed: false }, // Hard
    { id: 2, text: 'Write up report', completed: false }, // Medium
    { id: 3, text: 'Submit proposal', completed: false }, // Easy
    { id: 4, text: 'Refactor Code', completed: false }, // Grey -> Little to no progress but important
    { id: 5, text: 'Final Design', completed: false } // Can depend -> Use other task data to calculate?
];

export const tasksStore = writable(defaultTasks);

export const tasksCompletedStore = writable({
    tasks_completed_number: 4
});