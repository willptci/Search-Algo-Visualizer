import React, { Component } from 'react'
import './Node.css'
import { isLabelWithInternallyDisabledControl } from '@testing-library/user-event/dist/utils';

export default class Node extends Component {
    render() {
      const {
        col,
        row,
        isStart,
        isFinish,
        isWall,
        isWater,
        isSand,
        isJungle,
        onMouseDown,
        onMouseEnter,
        onMouseUp,
      } = this.props;
      const extraClassName = isFinish
        ? 'node-finish'
        : isStart
        ? 'node-start'
        : isWall
        ? 'node-wall'
        : isWater
        ? 'node-water'
        : isSand
        ? 'node-sand'
        : isJungle
        ? 'node-jungle'
        : '';
  
      return (
        <div
          id={`node-${row}-${col}`}
          className={`node ${extraClassName}`}
          onMouseDown={() => onMouseDown(row, col)}
          onMouseEnter={() => onMouseEnter(row, col)}
          onMouseUp={() => onMouseUp()}></div>
      );
    }
  }

