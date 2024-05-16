export function astar(grid, startNode, endNode) {
    if (!startNode || !endNode || startNode === endNode) {
        return []; // Return empty array if start or end nodes are invalid
    }

    const openSet = [startNode]; // Set of nodes to be evaluated
    const closedSet = new Set(); // Set of nodes already evaluated
    const visitedNodesInOrder = [];

    while (openSet.length > 0) {
        // Find the node with the lowest f cost in the open set
        let currentNode = openSet[0];
        for (let i = 1; i < openSet.length; i++) {
            if (openSet[i].fCost < currentNode.fCost || (openSet[i].fCost === currentNode.fCost && openSet[i].hCost < currentNode.hCost)) {
                currentNode = openSet[i];
            }
        }

        // Remove the current node from the open set and add it to the closed set
        openSet.splice(openSet.indexOf(currentNode), 1);
        closedSet.add(currentNode);
        visitedNodesInOrder.push(currentNode);

        // If the current node is the end node, reconstruct and return the path
        if (currentNode === endNode) {
            return visitedNodesInOrder;
        }

        // Generate neighbors of the current node
        const neighbors = getNeighbors(currentNode, grid);

        for (const neighbor of neighbors) {
            if (closedSet.has(neighbor) || neighbor.isWall) {
                continue;
            }

            const newMovementCostToNeighbor = currentNode.gCost + (getDistance(currentNode, neighbor) * getWeight(neighbor));
            if (newMovementCostToNeighbor < neighbor.gCost || !openSet.includes(neighbor)) {
                neighbor.gCost = newMovementCostToNeighbor;
                neighbor.hCost = getDistance(neighbor, endNode);
                neighbor.previousNode = currentNode;

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                }
            }
        }
    }

    return visitedNodesInOrder;
}

function getNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors;
}

function getDistance(nodeA, nodeB) {
    const dx = Math.abs(nodeA.col - nodeB.col) * Math.max(getWeight(nodeA), getWeight(nodeB));
    const dy = Math.abs(nodeA.row - nodeB.row) * Math.max(getWeight(nodeA), getWeight(nodeB));
    return dx + dy;
}

function getWeight(node) {
    let weight = 1;
    if (node.isWater) {
        weight = 5;
    } else if (node.isJungle) {
        weight = 10;
    } else if (node.isSand) {
        weight = 2;
    }
    return weight;
}

export function reconstructPath(endNode) {
    const path = [];
    let currentNode = endNode;
    while (currentNode !== null) {
        path.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return path;
}
