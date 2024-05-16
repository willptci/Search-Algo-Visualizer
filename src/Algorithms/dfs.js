export function dfs(grid, startNode, endNode) {
    if (!startNode || !endNode || startNode === endNode) {
        return []; // Return empty array if start or end nodes are invalid
    }
    
    const visitedNodesInOrder = []; // Array to store visited nodes
    const stack = []; // Initialize the stack for DFS
    stack.push(startNode); // Add the start node to the stack

    while (stack.length > 0) {
        const currentNode = stack.pop(); // Pop the current node from the stack

        if (currentNode === endNode) {
            return visitedNodesInOrder; // Return visited nodes if end node is reached
        }

        if (!currentNode.isVisited && !currentNode.isWall) {
            visitedNodesInOrder.push(currentNode);
            currentNode.isVisited = true; // Mark the current node as visited

            const neighbors = getUnvisitedNeighbors(currentNode, grid);
            for (const neighbor of neighbors) {
                neighbor.previousNode = currentNode;
                stack.push(neighbor); // Push unvisited neighbors to the stack
            }
        }
    }

    return visitedNodesInOrder;
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

export function getNodesOfDFSPath(endNode) {
    const nodesOfDFSPath = [];
    let currentNode = endNode;
    while (currentNode !== null) {
        nodesOfDFSPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesOfDFSPath;
}
