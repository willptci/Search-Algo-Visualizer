import React, { Component } from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesOfShortestPathDijksras} from '../Algorithms/dijkstra';
import { bfs, getNodesOfBFSPath } from '../Algorithms/bfs';
import { dfs, getNodesOfDFSPath } from '../Algorithms/dfs';
import { astar, reconstructPath } from '../Algorithms/astar';
import { Box, Button } from "@mui/material";
import './PathfindingVisualizer.css';

const START_ROW = 2;
const START_COL = 3;
const FINISH_ROW = 9;
const FINISH_COL = 26;

const InitialAlgo = "dijkstra";

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
            isTerrainMode: false,
            placeWater: true,
            placeSand: false,
            placeJungle: false,
            prevGrid: [],
            isAnimating: false,
            Algorithm: InitialAlgo,
        };
        this.visualizerRef = React.createRef();
    }

    componentDidMount() {
        const grid = getInitialGrid(this.state.startRow, this.state.startCol, this.state.finishRow, this.state.finishCol, this.state.isTerrainMode);
        this.setState({grid: grid, isTerrainMode: false})
    }

    componentDidUpdate(prevProps, prevState) {
        if (!this.state.isAnimating && prevState.grid !== this.state.grid) {
            this.setState({ prevGrid: prevState.grid });
            console.log("update");
        }
    }

    switchBFS() {
        console.log("switch BFS")
        this.setState({Algorithm: 'bfs'})
    }

    switchDFS() {
        this.setState({Algorithm: 'dfs'})
    }

    switchDijkstra() {
        this.setState({Algorithm: 'dijkstra'})
    }

    switchAstar() {
        this.setState({Algorithm: 'astar'});
    }

    searchAlgoCaller() {
        if (this.state.Algorithm === 'dijkstra') {
            this.visualizeDijkstra();
        } else if (this.state.Algorithm === 'bfs') {
            this.visualizeBFS();
        } else if (this.state.Algorithm === 'dfs') {
            this.visualizeDFS();
        } else if (this.state.Algorithm === 'astar') {
            this.visualizeAstar();
        }
    }

    handleMouseDown(row, col) {
        if (!this.state.isTerrainMode && !this.state.grid[row][col].isStart && !this.state.grid[row][col].isFinish) {
            const newGrid = getNewGridWithWall(this.state.grid, row, col)
            this.setState({grid: newGrid, mouseIsPressed: true});
        }
        if (this.state.isTerrainMode && !this.state.grid[row][col].isStart && !this.state.grid[row][col].isFinish) {
            const newGrid = getNewGridWithTerrain(this.state.grid, row, col, this.state.placeWater, this.state.placeSand, this.state.placeJungle);
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
            const newGrid = getNewGridWithStart(this.state.grid, row, col, this.state.startRow, this.state.startCol);
            this.setState({grid: newGrid, startRow: row, startCol: col});
        }
        if (this.state.draggingFinish && !this.state.grid[row][col].isWall && !this.state.grid[row][col].isStart) {
            const newGrid = getNewGridWithFinish(this.state.grid, row, col, this.state.finishRow, this.state.finishCol);
            this.setState({grid: newGrid, finishRow: row, finishCol: col});
        }
        if (!this.state.mouseIsPressed) return;
        if (!this.state.isTerrainMode && !this.state.grid[row][col].isStart && !this.state.grid[row][col].isFinish) {
            const newGrid = getNewGridWithWall(this.state.grid, row, col);
            this.setState({grid: newGrid});
        }
        if (this.state.isTerrainMode && !this.state.grid[row][col].isStart && !this.state.grid[row][col].isFinish) {
            const newGrid = getNewGridWithTerrain(this.state.grid, row, col, this.state.placeWater, this.state.placeSand, this.state.placeJungle);
            this.setState({grid: newGrid});
        }
    }

    handleMouseUp() {
        this.setState({mouseIsPressed: false, draggingStart: false, draggingFinish: false});
    }

    clearGrid() {
        this.clearAnimation();
        const newGrid = getInitialGrid(this.state.startRow, this.state.startCol, this.state.finishRow, this.state.finishCol);
        this.setState({grid: newGrid, isTerrainMode: false});
    }

    clearAnimation() {
        const { prevGrid, startRow, startCol, finishRow, finishCol, isTerrainMode } = this.state;
        const newGrid = getInitialGrid(startRow, startCol, finishRow, finishCol, isTerrainMode);

        prevGrid.forEach((row, rowIndex) => {
            row.forEach((node, colIndex) => {
                const newNode = {
                    ...node,
                    isVisited: false,
                };
                newGrid[rowIndex][colIndex] = newNode;
                this.clearNodeAnimation(node, rowIndex, colIndex, isTerrainMode);
            });
        });

        this.setState({ grid: newGrid });
    }

    clearNodeAnimation(node, row, col, isTerrainMode) {
        const nodeElement = document.getElementById(`node-${row}-${col}`);
        if (nodeElement) {
            node.isVisited = false;
            nodeElement.classList.remove('node-visited', 'node-shortest-path', 'node-visited-terrain', 'node-shortest-terrain-path');

            if (node.isStart) {
                nodeElement.classList.add('node-start');
            }
            if (node.isFinish) {
                nodeElement.classList.add('node-finish');
            }

            if (isTerrainMode) {
                this.addTerrainClasses(node, nodeElement);
            }

            if (isTerrainMode && (node.isStart || node.isFinish)) {
                nodeElement.classList.remove('node-water');
            }
        }
    }

    addTerrainClasses(node, nodeElement) {
        if (node.isWater) {
            nodeElement.classList.add('node-water');
        } else if (node.isSand) {
            nodeElement.classList.add('node-sand');
        } else if (node.isJungle) {
            nodeElement.classList.add('node-jungle');
        }
    }

    toggleTerrainMode() {
        this.setState({isTerrainMode: true}, () => {
            const newGrid = getInitialGrid(this.state.startRow, this.state.startCol, this.state.finishRow, this.state.finishCol, this.state.isTerrainMode);
            this.setState({grid: newGrid});
        });
        this.clearAnimation();
    }

    toggleGridMode() {
        this.setState({isTerrainMode: false}, () => {
            const newGrid = getInitialGrid(this.state.startRow, this.state.startCol, this.state.finishRow, this.state.finishCol, this.state.isTerrainMode);
            this.setState({grid: newGrid});
        });
        this.clearAnimation();
    }

    visualizeBFS() {
        const {grid} = this.state;
        this.setState({isAnimating: true});
        const startNode = grid[this.state.startRow][this.state.startCol];
        const finishNode = grid[this.state.finishRow][this.state.finishCol];
        const traversalInOrder = bfs(grid, startNode, finishNode);
        const nodesOfBFSPath = getNodesOfBFSPath(finishNode);
        this.animateAlgorithm(traversalInOrder, nodesOfBFSPath);
    }

    visualizeDijkstra() {
        const {grid} = this.state;
        this.setState({isAnimating: true});
        const startNode = grid[this.state.startRow][this.state.startCol];
        const finishNode = grid[this.state.finishRow][this.state.finishCol];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesOfShortestPathDijksras(finishNode);
        this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    visualizeDFS() {
        const {grid} = this.state;
        this.setState({isAnimating: true});
        const startNode = grid[this.state.startRow][this.state.startCol];
        const finishNode = grid[this.state.finishRow][this.state.finishCol];
        const visitedNodesInOrder = dfs(grid, startNode, finishNode);
        const nodesOfDFSPath = getNodesOfDFSPath(finishNode);
        this.animateAlgorithm(visitedNodesInOrder, nodesOfDFSPath);
    }

    visualizeAstar() {
        const {grid} = this.state;
        this.setState({isAnimating: true});
        const startNode = grid[this.state.startRow][this.state.startCol];
        const finishNode = grid[this.state.finishRow][this.state.finishCol];
        const visitedNodesInOrder = astar(grid, startNode, finishNode);
        const nodesOfAstarPath = reconstructPath(finishNode);
        this.animateAlgorithm(visitedNodesInOrder, nodesOfAstarPath);
    }

    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                  this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                this.setState({isAnimating: false});
                return;
              }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
                let additionalClass = '';
                if (node.isWater && !node.isStart && !node.isFinish) {
                    additionalClass = 'node-water';
                } else if (node.isSand && !node.isStart && !node.isFinish) {
                    additionalClass = 'node-sand';
                } else if (node.isJungle && !node.isStart && !node.isFinish) {
                    additionalClass = 'node-jungle'
                } else if (node.isFinish) {
                    additionalClass = 'node-finish'
                } else if (node.isStart) {
                    additionalClass = 'node-start'
                }

                if (this.state.isTerrainMode) {
                    nodeElement.className = `node node-visited-terrain ${additionalClass}`;
                } else {
                    nodeElement.className = `node node-visited ${additionalClass}`;
                }
            }, 10 * i);
        }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
          setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            if (this.state.isTerrainMode) {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-shortest-terrain-path';
            } else {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-shortest-path';
            }
          }, 50 * i);
        }
    }

    render() {
        const { grid, mouseIsPressed, isTerrainMode } = this.state;

        return (
            <div className='PathfindingVisualizer'  style={{ marginTop: this.state.isTerrainMode ? '27px' : '100px' }} >
              {isTerrainMode && (
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                  <Box style={{ display: 'flex', justifyContent: 'space-between', padding: '20px'}}>
                    <Button variant="contained" style={{ backgroundColor: "#009dc4", color: 'black', fontSize: '12px' }} onClick={ () => this.setState({placeWater: true, placeSand: false, placeJungle: false}) }>
                        Water
                    </Button>
                  </Box>
                  <Box style={{ display: 'flex', justifyContent: 'space-between', padding: '20px'}}>
                    <Button variant="contained" style={{ backgroundColor: "#f6d7b0", color: 'black', fontSize: '12px' }} onClick={ () => this.setState({placeWater: false, placeSand: true, placeJungle: false}) }>
                        Sand
                    </Button>
                  </Box>
                  <Box style={{ display: 'flex', justifyContent: 'space-between', padding: '20px'}}>
                    <Button variant="contained" style={{ backgroundColor: "#048243", color: 'black', fontSize: '12px' }} onClick={ () => this.setState({placeWater: false, placeSand: false, placeJungle: true}) }>
                        Jungle
                    </Button>
                  </Box>
                </div>
              )}
              <div className="grid">
                {grid.map((row, rowIdx) => {
                  return (
                    <div key={rowIdx}>
                      {row.map((node, nodeIdx) => {
                        const {row, col, isFinish, isStart, isWall, isWater, isSand, isJungle} = node;
                        return (
                          <Node
                            key={nodeIdx}
                            col={col}
                            row={row}
                            isStart={isStart}
                            isFinish={isFinish}
                            isWall={isWall}
                            isWater={isWater}
                            isSand={isSand}
                            isJungle={isJungle}
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
            </div>
        );
    }
}

const getInitialGrid = (startRow, startCol, finishRow, finishCol, isTerrainMode) => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
          currentRow.push(createNode(col, row, startRow, startCol, finishRow, finishCol, isTerrainMode));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createNode = (col, row, startRow, startCol, finishRow, finishCol, isTerrainMode) => {
    return {
        col,
        row,
        isStart: row === startRow && col === startCol,
        isFinish: row === finishRow && col === finishCol,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
        isWater: isTerrainMode,
        isSand: false,
        isJungle: false,
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

const getNewGridWithTerrain = (grid, row, col, placeWater, placeSand, placeJungle) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if (placeWater) {
        const newNode = {
            ...node,
            isWater: true,
            isSand: false,
            isJungle: false,
        };
        newGrid[row][col] = newNode;
        return newGrid;
    } else if (placeSand) {
        const newNode = {
            ...node,
            isWater: false,
            isSand: true,
            isJungle: false,
        };
        newGrid[row][col] = newNode;
        return newGrid;
    } else if (placeJungle) {
        const newNode = {
            ...node,
            isWater: false,
            isSand: false,
            isJungle: true,
        };
        newGrid[row][col] = newNode;
        return newGrid;
    }
}

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
