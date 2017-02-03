var Grid = (function() {

    'use strict';

    // Variables
    var width;
    var height;
    var size = 30;
    var grid;
    var disabled = false;


    /**
     * Initialize grid
     * 
     */
    function init(id, w, h) {
        // Get DOM element
        grid = document.getElementById(id);

        // Add node click event listener
        grid.addEventListener('click', function(e) {
            if (e.target.classList.contains('node') && ! disabled)
                onNodeClick(e);
        });

        // Set grid dimensions
        width = w;
        height = h;

        // Render grid HTML
        render();
    }


    /**
     * Render grid HTML
     * 
     */
    function render() {
        var html = '';
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                html += '<div id="'+x+'-'+y+'" class="node empty" style="width:'+size+'px;height:'+size+'px;top:'+(y*size+y+1)+'px;left:'+(x*size+x+1)+'px;"></div>';
            }
        }
        grid.style.width = (width * size + width + 1) + 'px';
        grid.style.height = (height * size + height + 1) + 'px';

        grid.innerHTML = html;

        // Set start and goal nodes
        set('start', getNode(0, 0));
        set('goal', getNode(width-1, height-1));
    }


    /**
     * Output grid as 2D array
     * 
     */
    function output() {
        var map = {
            'empty': 0,
            'start': 1,
            'goal': 2,
            'obstacle': 3
        };
        var array = [];
        for (var y = 0; y < height; y++) {
            array[y] = [];
            for (var x = 0; x < width; x++) {
                array[y][x] = map[getType(getNode(x, y))];
            }
        }
        return array;
    }

    
    /**
     * Walk by specified path
     * 
     */
    function walk(nodes) {
        if (disabled) return;
        disabled = true;
        
        // Clear previous path
        clearPath();

        // Unselect node, if any was selected
        unselect();

        // Loop through path nodes
        nodes.forEach((n, index) => {
            (function(i) {
                setTimeout(function() {
                    set('path', getNode(n.x, n.y));
                    if (nodes.length-1 === i)
                        disabled = false;
                }, (i + 1) * 30);
            })(index);
        });
    }


    /**
     * Clear grid from path and obstacles
     * 
     */
    function clear() {
        if (disabled) return;

        clearPath();
        grid.querySelectorAll(':not(.start):not(.goal)').forEach(n => {
            set('empty', n);
        });
    }


    /**
     * Generate random obstacles
     * 
     */
    function randomize() {
        if (disabled) return;

        clear();
        var count = width * height * 0.2;
        for (var i = 0; i < count; i++) {
            var node = getNode(rand(0, width-1), rand(0, height-1));
            if ( ! isStart(node) && ! isGoal(node))
                set('obstacle', node);
        }
    }


    /**
     * Set specific node type
     * 
     */
    function set(type, node) {
        if (type === 'path') {
            node.classList.add('path');
            return;
        }
        node.className = 'node ' + type;
    }


    /**
     * Check if it's start node
     * 
     */
    function isStart(node) {
        return node.classList.contains('start');
    }


    /**
     * Check if it's goal node
     * 
     */
    function isGoal(node) {
        return node.classList.contains('goal');
    }


    /**
     * Get node type
     * 
     */
    function getType(node) {
        return node.classList.item(1);
    }


    /**
     * Get node by position
     * 
     */
    function getNode(x, y) {
        return document.getElementById(x+'-'+y);
    }


    /**
     * Clear path
     * 
     */
    function clearPath() {
        grid.querySelectorAll('.path').forEach(n => {
            n.classList.remove('path');
        });
    }


    /**
     * Event: mouse click on node
     * 
     */
    function onNodeClick(e) {        
        var node = e.target;
        var type = getType(node);
        var selected = getSelected();

        // Check if there's a selected node
        if (selected) {
            unselect();
            if (isStart(node) || isGoal(node)) {
                if (selected !== node)
                    select(node);
            } else {
                set(getType(selected), node);
                set('empty', selected);
            }
            return;
        }

        // Check for node type
        switch (type) {
            case 'start':
            case 'goal':
                select(node);
                break;
            case 'obstacle':
                set('empty', node);
                break;
            default:
                 set('obstacle', node);
        }
    }


    /**
     * Select node
     * 
     */
    function select(node) {
        node.classList.add('selected');
    }


    /**
     * Unselect selected node
     * 
     */
    function unselect() {
        var node = getSelected();
        if (node)
            node.classList.remove('selected');
    }


    /**
     * Get selected node
     * 
     */
    function getSelected() {
        return grid.querySelector('.selected');
    }


    /**
     * Generate random number
     * 
     */
	function rand(from, to) {
		return (Math.floor(Math.random() * (to - from + 1)) + from);
	}


    /**
     * Public interface
     * 
     */
    return {
        init: init,
        walk: walk,
        randomize: randomize,
        clear: clear,
        output: output
    };

}());
