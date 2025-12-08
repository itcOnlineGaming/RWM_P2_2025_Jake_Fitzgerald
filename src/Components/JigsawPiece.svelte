<script lang="ts">
    export let type: 'corner-tl' | 'corner-tr' | 'corner-bl' | 'corner-br' | 
                     'edge-top' | 'edge-right' | 'edge-bottom' | 'edge-left' | 
                     'middle';
    export let color: string = '#4CAF50';
    export let size: number = 80;
    export let row: number = 0;
    export let col: number = 0;
    export let cols: number = 4;
    
    // Deterministic function to decide if an edge has a tab
    // Returns true if the edge going RIGHT from position (r,c) has a tab
    function edgeHasRightTab(r: number, c: number): boolean {
        return ((r * 7 + c * 13) % 2) === 0;
    }
    
    // Returns true if the edge going DOWN from position (r,c) has a tab
    function edgeHasDownTab(r: number, c: number): boolean {
        return ((r * 11 + c * 17) % 2) === 0;
    }
    
    // Generate path based on piece type with interlocking edges
    function getPiecePath(): string {
        const s = size;
        const mid = s / 2;
        const tabSize = 10;
        
        // Determine what connector this piece needs on each side
        let topConnector: 'flat' | 'tab' | 'slot' = 'flat';
        let rightConnector: 'flat' | 'tab' | 'slot' = 'flat';
        let bottomConnector: 'flat' | 'tab' | 'slot' = 'flat';
        let leftConnector: 'flat' | 'tab' | 'slot' = 'flat';
        
        // TOP EDGE
        if (type === 'corner-tl' || type === 'corner-tr' || type === 'edge-top') {
            topConnector = 'flat';
        } else {
            // Check the edge between this piece and the piece above
            // The edge belongs to the piece above (row-1), and it goes DOWN
            const edgeAboveHasTab = edgeHasDownTab(row - 1, col);
            // If edge has tab going down, this piece receives it as a slot
            topConnector = edgeAboveHasTab ? 'slot' : 'tab';
        }
        
        // RIGHT EDGE
        if (type === 'corner-tr' || type === 'corner-br' || type === 'edge-right') {
            rightConnector = 'flat';
        } else {
            // Check the edge between this piece and the piece to the right
            // The edge belongs to THIS piece, going RIGHT
            const thisEdgeHasTab = edgeHasRightTab(row, col);
            rightConnector = thisEdgeHasTab ? 'tab' : 'slot';
        }
        
        // BOTTOM EDGE
        if (type === 'corner-bl' || type === 'corner-br' || type === 'edge-bottom') {
            bottomConnector = 'flat';
        } else {
            // Check the edge between this piece and the piece below
            // The edge belongs to THIS piece, going DOWN
            const thisEdgeHasTab = edgeHasDownTab(row, col);
            bottomConnector = thisEdgeHasTab ? 'tab' : 'slot';
        }
        
        // LEFT EDGE
        if (type === 'corner-tl' || type === 'corner-bl' || type === 'edge-left') {
            leftConnector = 'flat';
        } else {
            // Check the edge between this piece and the piece to the left
            // The edge belongs to the piece on the left (col-1), going RIGHT
            const edgeLeftHasTab = edgeHasRightTab(row, col - 1);
            // If edge has tab going right, this piece receives it as a slot
            leftConnector = edgeLeftHasTab ? 'slot' : 'tab';
        }
        
        // Build the path
        let path = `M 0,0`;
        
        // TOP EDGE
        if (topConnector === 'flat') {
            path += ` L ${s},0`;
        } else if (topConnector === 'tab') {
            path += ` L ${mid - tabSize},0`;
            path += ` Q ${mid - tabSize},${-tabSize} ${mid},${-tabSize}`;
            path += ` Q ${mid + tabSize},${-tabSize} ${mid + tabSize},0`;
            path += ` L ${s},0`;
        } else { // slot
            path += ` L ${mid - tabSize},0`;
            path += ` Q ${mid - tabSize},${tabSize} ${mid},${tabSize}`;
            path += ` Q ${mid + tabSize},${tabSize} ${mid + tabSize},0`;
            path += ` L ${s},0`;
        }
        
        // RIGHT EDGE
        if (rightConnector === 'flat') {
            path += ` L ${s},${s}`;
        } else if (rightConnector === 'tab') {
            path += ` L ${s},${mid - tabSize}`;
            path += ` Q ${s + tabSize},${mid - tabSize} ${s + tabSize},${mid}`;
            path += ` Q ${s + tabSize},${mid + tabSize} ${s},${mid + tabSize}`;
            path += ` L ${s},${s}`;
        } else { // slot
            path += ` L ${s},${mid - tabSize}`;
            path += ` Q ${s - tabSize},${mid - tabSize} ${s - tabSize},${mid}`;
            path += ` Q ${s - tabSize},${mid + tabSize} ${s},${mid + tabSize}`;
            path += ` L ${s},${s}`;
        }
        
        // BOTTOM EDGE
        if (bottomConnector === 'flat') {
            path += ` L 0,${s}`;
        } else if (bottomConnector === 'tab') {
            path += ` L ${mid + tabSize},${s}`;
            path += ` Q ${mid + tabSize},${s + tabSize} ${mid},${s + tabSize}`;
            path += ` Q ${mid - tabSize},${s + tabSize} ${mid - tabSize},${s}`;
            path += ` L 0,${s}`;
        } else { // slot
            path += ` L ${mid + tabSize},${s}`;
            path += ` Q ${mid + tabSize},${s - tabSize} ${mid},${s - tabSize}`;
            path += ` Q ${mid - tabSize},${s - tabSize} ${mid - tabSize},${s}`;
            path += ` L 0,${s}`;
        }
        
        // LEFT EDGE
        if (leftConnector === 'flat') {
            path += ` L 0,0`;
        } else if (leftConnector === 'tab') {
            path += ` L 0,${mid + tabSize}`;
            path += ` Q ${-tabSize},${mid + tabSize} ${-tabSize},${mid}`;
            path += ` Q ${-tabSize},${mid - tabSize} 0,${mid - tabSize}`;
            path += ` L 0,0`;
        } else { // slot
            path += ` L 0,${mid + tabSize}`;
            path += ` Q ${tabSize},${mid + tabSize} ${tabSize},${mid}`;
            path += ` Q ${tabSize},${mid - tabSize} 0,${mid - tabSize}`;
            path += ` L 0,0`;
        }
        
        path += ` Z`;
        return path;
    }
</script>

<svg width={size} height={size} viewBox="{-15} {-15} {size + 30} {size + 30}">
    <path 
        d={getPiecePath()} 
        fill={color}
        stroke="#333"
        stroke-width="1.5"
        class="jigsaw-piece"
    />
</svg>

<style>
    .jigsaw-piece 
    {
        filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.2));
        transition: transform 0.2s ease;
    }
    
    .jigsaw-piece:hover 
    {
        transform: scale(1.05);
    }
</style>