<script lang="ts">
    import JigsawPiece from './JigsawPiece.svelte';
    
    export let tasks: Array<{id: number, text: string, completed: boolean, difficulty: string}>;
    export let totalPieces: number = 12;
    
    type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'GREY';
    const difficultyColours: Record<Difficulty, string> = {
        EASY: "#4CAF50",
        MEDIUM: "#FFC107",
        HARD: "#F44336",
        GREY: "#9E9E9E"
    };
    
    const placeholderColor = "#E0E0E0";
    const completedPlaceholderColor = "#4CAF50";
    
    $: allTasksCompleted = tasks.length > 0 && tasks.every(task => task.completed);
    
    function getTaskColour(task: any): string {
        if (!task.completed) {
            return "#9E9E9E";
        }
        return difficultyColours[task.difficulty as Difficulty] || '#ccc';
    }
    
    function getGridDimensions(count: number): {rows: number, cols: number} {
        if (count <= 0) return {rows: 0, cols: 0};
        if (count <= 4) return {rows: 2, cols: 2};
        if (count <= 6) return {rows: 2, cols: 3};
        if (count <= 9) return {rows: 3, cols: 3};
        if (count <= 12) return {rows: 3, cols: 4};
        if (count <= 16) return {rows: 4, cols: 4};
        if (count <= 20) return {rows: 4, cols: 5};
        
        const cols = Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / cols);
        return {rows, cols};
    }
    
    function getPieceType(index: number, rows: number, cols: number): 'corner-tl' | 'corner-tr' | 'corner-bl' | 'corner-br' | 'edge-top' | 'edge-right' | 'edge-bottom' | 'edge-left' | 'middle' {
        const row = Math.floor(index / cols);
        const col = index % cols;
        
        const isTopRow = row === 0;
        const isBottomRow = row === rows - 1;
        const isLeftCol = col === 0;
        const isRightCol = col === cols - 1;
        
        if (isTopRow && isLeftCol) return 'corner-tl';
        if (isTopRow && isRightCol) return 'corner-tr';
        if (isBottomRow && isLeftCol) return 'corner-bl';
        if (isBottomRow && isRightCol) return 'corner-br';
        
        if (isTopRow) return 'edge-top';
        if (isBottomRow) return 'edge-bottom';
        if (isLeftCol) return 'edge-left';
        if (isRightCol) return 'edge-right';
        
        return 'middle';
    }
    
    // Shuffle function using Fisher-Yates algorithm
    function shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // Create array with tasks in random positions but maintain grid structure
    let allPieces: any[] = [];
    $: {
        const shuffledTasks = shuffleArray([...tasks]);
        const placeholderCount = Math.max(0, totalPieces - tasks.length);
        
        // Create array of all positions
        const positions = Array.from({length: totalPieces}, (_, i) => i);
        const shuffledPositions = shuffleArray(positions);
        
        // Place tasks at random positions
        const tempPieces = Array(totalPieces).fill(null);
        shuffledTasks.forEach((task, i) => {
            tempPieces[shuffledPositions[i]] = task;
        });
        
        allPieces = tempPieces;
    }
    
    $: dimensions = getGridDimensions(totalPieces);
    $: rows = dimensions.rows;
    $: cols = dimensions.cols;
</script>

<div class="jigsaw-board">
    <div 
        class="jigsaw-grid" 
        style="
            grid-template-columns: repeat({cols}, 130px); 
            grid-template-rows: repeat({rows}, 130px);
        ">
        {#each allPieces as piece, i}
            <div class="piece-container tooltip-container" title={piece?.text || 'Empty slot'}>
                <JigsawPiece 
                    type={getPieceType(i, rows, cols)}
                    color={piece ? getTaskColour(piece) : (allTasksCompleted ? completedPlaceholderColor : placeholderColor)}
                    size={160}
                    row={Math.floor(i / cols)}
                    col={i % cols}
                    cols={cols}
                />
                {#if piece}
                    <span class="piece-label">{piece.text.slice(0, 15)}{piece.text.length > 15 ? '...' : ''}</span>
                    <span class="tooltip-text">
                        <strong>{piece.text}</strong><br />
                        Status: 
                        <span class="{piece.completed ? 'status-completed' : 'status-incomplete'}">
                            {piece.completed ? 'Completed' : 'Not completed'}
                        </span><br />
                        Difficulty: <span class="difficulty-badge" style="color: {getTaskColour(piece)}">{piece.difficulty}</span>
                    </span>
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
        padding: 0;
        border: 3px solid black;
        width: fit-content;
        margin: 2rem auto;
    }
    
    .jigsaw-grid {
        display: grid;
        gap: 0;
    }
    
    .tooltip-container {
        position: relative;
        display: inline-block;
    }
    
    .piece-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 160px;
        height: 160px;
    }
    
    .tooltip-text {
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.2s;
        position: absolute;
        bottom: 110%;
        left: 50%;
        transform: translateX(-50%);
        padding: 8px 12px;
        border-radius: 6px;
        background-color: #333;
        color: white;
        font-size: 0.9rem;
        white-space: nowrap;
        z-index: 100;
        pointer-events: none;
    }
    
    .piece-container:hover .tooltip-text {
        visibility: visible;
        opacity: 1;
    }
    
    .status-completed {
        color: #4CAF50;
        font-weight: bold;
    }
    
    .status-incomplete {
        color: #F44336;
        font-weight: bold;
    }
    
    .difficulty-badge {
        font-weight: bold;
    }
    
    .piece-label {
        position: absolute;
        font-size: 1rem;
        font-weight: bold;
        color: white;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        pointer-events: none;
        text-align: center;
        max-width: 130px;
        line-height: 1.2;
        z-index: 10;
    }
    
    .piece-label.empty {
        font-size: 2.5rem;
        color: #999;
        text-shadow: none;
        z-index: 10;
    }
</style>