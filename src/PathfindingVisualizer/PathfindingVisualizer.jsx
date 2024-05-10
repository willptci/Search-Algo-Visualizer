import React, { Component } from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesOfShortestPath} from '../Algorithms/dijkstra';

import './PathfindingVisualizer.css';

const START_ROW = 2;
const START_COL = 3;
const FINISH_ROW = 9;
const FINISH_COL = 26;

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
            startRow: START_ROW,
            startCol: START_COL,
            finishRow: FINISH_ROW,
            finishCol: FINISH_COL,
        };
    }

    componentDidMount() {
        const grid = getInitialGrid(this.state.startRow, this.state.startCol, this.state.finishRow, this.state.finishCol);
        this.setState({grid})
    }

    handleMouseDown(row, col) {
        if (!this.state.grid[row][col].isStart && !this.state.grid[row][col].isFinish) {
            const newGrid = getNewGridWithWall(this.state.grid, row, col)
            this.setState({grid: newGrid, mouseIsPressed: true});
        }
        if (this.state.grid[row][col].isStart) {
            this.setState({draggingStart: true});
        }
        if (this.state.grid[row][col].isFinish) {
            this.setState({draggingFinish: true});
        }
    }

    handleMouseEnter(row, col) {
        if (this.state.draggingStart && !this.state.grid[row][col].isWall && !this.state.grid[row][col].isFinish) {
            const newGrid = getNewGridWithStart(this.state.grid, row, col, this.state.startRow, this.state.startCol)
            this.setState({grid: newGrid, startRow: row, startCol: col})
        }
        if (this.state.draggingFinish && !this.state.grid[row][col].isWall && !this.state.grid[row][col].isStart) {
            const newGrid = getNewGridWithFinish(this.state.grid, row, col, this.state.finishRow, this.state.finishCol)
            this.setState({grid: newGrid, finishRow: row, finishCol: col})
        }
        if (!this.state.mouseIsPressed) return;
        if (!this.state.grid[row][col].isStart && !this.state.grid[row][col].isFinish) {
            const newGrid = getNewGridWithWall(this.state.grid, row, col)
            this.setState({grid: newGrid});
        }
    }

    handleMouseUp() {
        this.setState({mouseIsPressed: false, draggingStart: false, draggingFinish: false});
    }

    clearGrid() {
        const newGrid = getInitialGrid(this.state.startRow, this.state.startCol, this.state.finishRow, this.state.finishCol);
        this.setState({grid: newGrid});
    }

    clearAnimation() {
        const { grid } = this.state;
        grid.forEach(row => {
            row.forEach(node => {
                const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
                if (nodeElement) {
                    if (!node.isWall && !node.isStart && !node.isFinish) {
                        nodeElement.className = 'node';
                    }
                    if (node.isStart) {
                        nodeElement.className = 'node node-start';
                    }
                    if (node.isFinish) {
                        nodeElement.className = 'node node-finish';;
                    }
                }
            })
        });

        this.setState({ visitedNodesInOrder: [] });
    }

    visualizeDijkstra() {
        const {grid} = this.state;
        const startNode = grid[this.state.startRow][this.state.startCol];
        const finishNode = grid[this.state.finishRow][this.state.finishCol];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesOfShortestPath(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                  this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
              }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
            }, 10 * i);
        }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
          setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-shortest-path';
          }, 50 * i);
        }
    }


    render() {
        const { grid, mouseIsPressed } = this.state;

        return (
            <>
              <button onClick={() => this.visualizeDijkstra()}>
                Visualize Dijkstra's Algorithm
              </button>
              <button onClick={() => this.clearGrid()}>
                Clear Grid
              </button>
              <button onClick={() => this.clearAnimation()}>
                Back
              </button>
              <div className="grid">
                {grid.map((row, rowIdx) => {
                  return (
                    <div key={rowIdx}>
                      {row.map((node, nodeIdx) => {
                        const {row, col, isFinish, isStart, isWall} = node;
                        return (
                          <Node
                            key={nodeIdx}
                            col={col}
                            row={row}
                            isStart={isStart}
                            isFinish={isFinish}
                            isWall={isWall}
                            mouseIsPressed={mouseIsPressed}
                            onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                            onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                            onMouseUp={() => this.handleMouseUp()}
                            ></Node>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </>
        );
    }
}

const getInitialGrid = (startRow, startCol, finishRow, finishCol) => {
    const grid = [];
    for (let row = 0; row < 25; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
          currentRow.push(createNode(col, row, startRow, startCol, finishRow, finishCol));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createNode = (col, row, startRow, startCol, finishRow, finishCol) => {
    return {
        col,
        row,
        isStart: row === startRow && col === startCol,
        isFinish: row === finishRow && col === finishCol,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};

const getNewGridWithWall = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const getNewGridWithStart = (grid, newRow, newCol, startRow, startCol) => {
    const newGrid = grid.slice();
    // old start
    const prevStart = newGrid[startRow][startCol];
    const updatedPrevStart = {
        ...prevStart,
        isStart: false,
    };
    // new start
    const newStart = newGrid[newRow][newCol];
    const  updatedNewStart = {
        ...newStart,
        isStart: true,
    };
    newGrid[startRow][startCol] = updatedPrevStart;
    newGrid[newRow][newCol] = updatedNewStart;
    return newGrid;
}

const getNewGridWithFinish = (grid, newRow, newCol, finishRow, finishCol) => {
    const newGrid = grid.slice();
    // old finish
    const prevFinish = newGrid[finishRow][finishCol];
    const updatedPrevFinish = {
        ...prevFinish,
        isFinish: false,
    };
    // new finish
    const newFinish = newGrid[newRow][newCol];
    const  updatedNewFinish = {
        ...newFinish,
        isFinish: true,
    };
    newGrid[finishRow][finishCol] = updatedPrevFinish;
    newGrid[newRow][newCol] = updatedNewFinish;
    return newGrid;
}