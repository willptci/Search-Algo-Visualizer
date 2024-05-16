export function bfs(grid, startNode, endNode) {
    if (!startNode || !endNode || startNode === endNode) {
        return false; // Return empty array if start or end nodes are invalid
    }
    
    const traversalInOrder = [];
    const queueNodes = []; // Initialize the queue for BFS
    queueNodes.push(startNode); // Add the start node to the queue
    startNode.isVisited = true; // Mark the start node as visited

    while (queueNodes.length > 0) {
        console.log(traversalInOrder.length);
        const closestNode = queueNodes.shift(); // Dequeue the closest node
        if (closestNode.isWall) continue;
        traversalInOrder.push(closestNode);
        if (closestNode === endNode) {
            return traversalInOrder; // Return the path if end node is reached
        }
        updateUnvisitedNeighbors(closestNode, grid, queueNodes); // Update unvisited neighbors of the current node
    }
    
    return traversalInOrder;
}

function updateUnvisitedNeighbors(node, grid, queueNodes) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        neighbor.previousNode = node;
        neighbor.isVisited = true; 
        queueNodes.push(neighbor);
    }
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

export function getNodesOfBFSPath(endNode) {
    const nodesOfBFSPath = [];
    let currentNode = endNode;
    while (currentNode !== null) {
        nodesOfBFSPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesOfBFSPath;
}
