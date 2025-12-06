<script lang="ts">
    import JigsawPiece from './JigsawPiece.svelte';
    
    export let tasks: Array<{id: number, text: string, completed: boolean, difficulty: string}>;
    export let totalPieces: number = 12; // Total jigsaw pieces to show (including placeholders)
    
    type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'GREY';
    const difficultyColours: Record<Difficulty, string> = {
        EASY: "#4CAF50",
        MEDIUM: "#FFC107",
        HARD: "#F44336",
        GREY: "#9E9E9E"
    };
    
    // Placeholder color - lighter grey for unassigned pieces (or green when all complete)
    const placeholderColor = "#E0E0E0";
    const completedPlaceholderColor = "#4CAF50"; // Green when all tasks done
    
    // Check if all tasks are completed
    $: allTasksCompleted = tasks.length > 0 && tasks.every(task => task.completed);
    
    function getTaskColour(task: any): string {
        if (!task.completed) {
            return "#9E9E9E";
        }
        return difficultyColours[task.difficulty as Difficulty] || '#ccc';
    }
    
    // Calculate grid dimensions based on total piece count
    function getGridDimensions(count: number): {rows: number, cols: number} {
        if (count <= 0) return {rows: 0, cols: 0};
        if (count <= 4) return {rows: 2, cols: 2};
        if (count <= 6) return {rows: 2, cols: 3};
        if (count <= 9) return {rows: 3, cols: 3};
        if (count <= 12) return {rows: 3, cols: 4};
        if (count <= 16) return {rows: 4, cols: 4};
        if (count <= 20) return {rows: 4, cols: 5};
        
        // For larger counts, make roughly square
        const cols = Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / cols);
        return {rows, cols};
    }
    
    // Determine piece type based on position
    function getPieceType(index: number, rows: number, cols: number): 'corner-tl' | 'corner-tr' | 'corner-bl' | 'corner-br' | 'edge-top' | 'edge-right' | 'edge-bottom' | 'edge-left' | 'middle' {
        const row = Math.floor(index / cols);
        const col = index % cols;
        
        const isTopRow = row === 0;
        const isBottomRow = row === rows - 1;
        const isLeftCol = col === 0;
        const isRightCol = col === cols - 1;
        
        // Corners
        if (isTopRow && isLeftCol) return 'corner-tl';
        if (isTopRow && isRightCol) return 'corner-tr';
        if (isBottomRow && isLeftCol) return 'corner-bl';
        if (isBottomRow && isRightCol) return 'corner-br';
        
        // Edges
        if (isTopRow) return 'edge-top';
        if (isBottomRow) return 'edge-bottom';
        if (isLeftCol) return 'edge-left';
        if (isRightCol) return 'edge-right';
        
        // Middle
        return 'middle';
    }
    
    // Create array of pieces: real tasks + placeholders
    $: allPieces = [...tasks, ...Array(Math.max(0, totalPieces - tasks.length)).fill(null)];
    $: dimensions = getGridDimensions(totalPieces);
    $: rows = dimensions.rows;
    $: cols = dimensions.cols;
</script>

<div class="jigsaw-board">
    <div 
        class="jigsaw-grid" 
        style="
            grid-template-columns: repeat({cols}, 80px); 
            grid-template-rows: repeat({rows}, 80px);
        ">
        {#each allPieces as piece, i}
            <div class="piece-container" title={piece?.text || 'Empty slot'}>
                <JigsawPiece 
                    type={getPieceType(i, rows, cols)}
                    color={piece ? getTaskColour(piece) : (allTasksCompleted ? completedPlaceholderColor : placeholderColor)}
                    size={80}
                />
                {#if piece}
                    <span class="piece-label">{piece.text.slice(0, 15)}{piece.text.length > 15 ? '...' : ''}</span>
                {:else}
                    <span class="piece-label empty">?</span>
                {/if}
            </div>
        {/each}
    </div>
</div>

<style>
    .jigsaw-board {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
    }
    
    .jigsaw-grid {
        display: grid;
        gap: -1px; /* Overlap slightly for puzzle effect */
    }
    
    .piece-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .piece-label {
        position: absolute;
        font-size: 0.65rem;
        font-weight: bold;
        color: white;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        pointer-events: none;
        text-align: center;
        max-width: 70px;
    }
    
    .piece-label.empty {
        font-size: 1.5rem;
        color: #999;
        text-shadow: none;
    }
</style>