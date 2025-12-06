<script lang="ts">
    export let type: 'corner-tl' | 'corner-tr' | 'corner-bl' | 'corner-br' | 
                     'edge-top' | 'edge-right' | 'edge-bottom' | 'edge-left' | 
                     'middle';
    export let color: string = '#4CAF50';
    export let size: number = 80;
    
    // Simple jigsaw connector (tab/slot)
    const tab = `q 0,-10 10,-10 t 10,10`; // outward tab
    const slot = `q 0,10 10,10 t 10,-10`; // inward slot
    
    // Generate path based on piece type
    function getPiecePath(type: string): string {
        const s = size;
        const mid = s / 2;
        
        switch(type) {
            case 'corner-tl':
                // Top-Left: straight top, straight left, tab right, tab bottom
                return `M 0,0 L ${s},0 L ${s},${mid-10} ${tab} L ${s},${s} 
                        L ${mid+10},${s} ${slot} L 0,${s} Z`;
            
            case 'corner-tr':
                // Top-Right: straight top, straight right, tab bottom, slot left
                return `M 0,0 L ${s},0 L ${s},${s} L ${mid+10},${s} ${slot} 
                        L 0,${s} L 0,${mid+10} ${tab} Z`;
            
            case 'corner-bl':
                // Bottom-Left: straight left, straight bottom, tab top, tab right
                return `M 0,0 L ${mid-10},0 ${tab} L ${s},0 L ${s},${mid-10} ${tab} 
                        L ${s},${s} L 0,${s} Z`;
            
            case 'corner-br':
                // Bottom-Right: straight right, straight bottom, slot top, slot left
                return `M 0,0 L ${s},0 L ${s},${s} L 0,${s} L 0,${mid+10} ${tab} 
                        L 0,0 L ${mid+10},0 ${slot} Z`;
            
            case 'edge-top':
                // Top edge: straight top, tab/slot on other sides
                return `M 0,0 L ${s},0 L ${s},${mid-10} ${tab} L ${s},${s} 
                        L ${mid+10},${s} ${slot} L 0,${s} L 0,${mid+10} ${tab} Z`;
            
            case 'edge-right':
                // Right edge: straight right, tab/slot on other sides
                return `M 0,0 L ${mid-10},0 ${tab} L ${s},0 L ${s},${s} 
                        L ${mid+10},${s} ${slot} L 0,${s} L 0,${mid+10} ${tab} Z`;
            
            case 'edge-bottom':
                // Bottom edge: straight bottom, tab/slot on other sides
                return `M 0,0 L ${mid-10},0 ${tab} L ${s},0 L ${s},${mid-10} ${tab} 
                        L ${s},${s} L 0,${s} L 0,${mid+10} ${tab} Z`;
            
            case 'edge-left':
                // Left edge: straight left, tab/slot on other sides
                return `M 0,0 L ${mid-10},0 ${tab} L ${s},0 L ${s},${mid-10} ${tab} 
                        L ${s},${s} L ${mid+10},${s} ${slot} L 0,${s} Z`;
            
            case 'middle':
            default:
                // Middle: tabs/slots on all sides
                return `M 0,0 L ${mid-10},0 ${tab} L ${s},0 L ${s},${mid-10} ${tab} 
                        L ${s},${s} L ${mid+10},${s} ${slot} L 0,${s} L 0,${mid+10} ${tab} Z`;
        }
    }
</script>

<svg width={size} height={size} viewBox="0 0 {size} {size}">
    <path 
        d={getPiecePath(type)} 
        fill={color}
        stroke="#333"
        stroke-width="1.5"
        class="jigsaw-piece"
    />
</svg>

<style>
    .jigsaw-piece {
        filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.2));
        transition: transform 0.2s ease;
    }
    
    .jigsaw-piece:hover {
        transform: scale(1.05);
    }
</style>