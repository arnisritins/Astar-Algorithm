var Astar = (function() {

    'use strict';

    // Node structure
    function Node(x, y, obstacle = false) {
        this.x = x;
        this.y = y;
        this.g = 0;
        this.h = 0;
        this.f = 0;
        this.obstacle = obstacle;
        this.closed = false;
        this.parent = null;
    }

    // All nodes
    var nodes = [];

    // Start node
    var start = null;

    // Goal node
    var goal = null;

    // Open list
    var open = [];

    // Grid size
    var width;
    var height;


    /**
     * Initialize
     * 
     */
    function init(grid) {
        // Set field size
        height = grid.length;
        width = grid[0].length;

        // Create 2D array of node objects
        for (var y = 0; y < height; y++) {
            nodes[y] = [];
            for (var x = 0; x < width; x++) {
                var val = grid[y][x];
                var node = new Node(x, y, val === 3);
                if (val === 1)
                    start = node;
                else if (val === 2)
                    goal = node;
                nodes[y][x] = node;
            }
        }
    }


    /**
     * Find path by using A* algorithm
     * 
     */
    function find(grid) {
        init(grid);
        return run();
    }


    /**
     * Run main loop
     * 
     */
    function run() {
        // Add start node to the open list
        open = [start];

        // Loop while open list is not empty
        while (open.length > 0) {
            // Get node with lowest F cost from open list
            var current = getLowestF();

            // Remove current node from open list
            open.splice(open.indexOf(current), 1);

            // Mark current node as closed
            current.closed = true;

            // Check if goal node is reached
            if (current === goal)
                return getPath(current);

            var neighbours = getNeighbours(current);

            // Loop through all neighbours
            neighbours.forEach(n => {
                // Skip node if it is closed or not walkable
                if (n.closed || n.obstacle) return;

                if (open.includes(n)) {
                    // Check for shortest path
                    if (current.g + 1 >= n.g) return; 
                }                
                else {
                    open.unshift(n);
                }

                // Link with current node
                n.parent = current;

                // Calculate costs
                n.h = heuristicCost(n);
                n.g = current.g + 1;
                n.f = n.g + n.h;
            });
        }

        // The path was not found
        return false;
    }


    /**
     * Get open node with lowest F cost
     * 
     */
    function getLowestF() {
        var node = open[0];
        for (var i = 1; i < open.length; i++)
            if (open[i].f < node.f)
                node = open[i];
        return node;
    }


    /**
     * Get all adjacent nodes to specified node
     * 
     */
    function getNeighbours(node) {
        var neighbours = [];
        var x = node.x;
        var y = node.y;

        if (y+1 < height) neighbours.push(nodes[y+1][x]);
        if (y-1 >= 0) neighbours.push(nodes[y-1][x]);
        if (x+1 < width) neighbours.push(nodes[y][x+1]);
        if (x-1 >= 0) neighbours.push(nodes[y][x-1]);

        return neighbours;
    }


    /**
     * Recreate path
     * 
     */
    function getPath(node) {
        var path = [];
        // Go through linked nodes
        while (node.parent !== null) {
            path.unshift({x: node.x, y: node.y});
            node = node.parent;
        }
        return path;
    }


    /**
     * Calculate heuristic cost
     * 
     */
    function heuristicCost(node) {
        return Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y);
    }


    /**
     * Public interface
     * 
     */
    return {
        find: find
    };

}());
