import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={"square " + props.colour} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        colour={this.getColour(i)}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  getColour(i) {
    let coords = get2D(i);

    if (coords[0] % 2) {
      return i % 2 ? 'white' : 'black';
    } else {
      return i % 2 ? 'black' : 'white';
    }
  }

  renderRow(i) {
    let row = [];
    for (let j = 0; j < 8; j++) {
      row.push(this.renderSquare(i * 8 + j));
    }

    return (
      <div className="board-row">
        {row}
      </div> 
    )
  }

  render() {
    let rows = [];

    for (let i = 0; i < 8; i++) {
      rows.push(this.renderRow(i));
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: this.setup(),
      }],
      xIsNext: true,
    }
  }

  setup() {
    let squares = Array(64).fill(null);
    for (let i = 0; i < 8; i++) {
      let coords = get2D(i);
      
      if (coords[1] % 2) {
        squares[i] = 'X';
      }
    }
    for (let i = 7; i < 16; i++) {
      let coords = get2D(i);
      
      if (!(coords[1] % 2)) {
        squares[i] = 'X';
      }
    }

    for (let i = 48; i < 56; i++) {
      let coords = get2D(i);
      
      if (coords[1] % 2) {
        squares[i] = 'O';
      }
    }
    for (let i = 56; i < 64; i++) {
      let coords = get2D(i);
      
      if (!(coords[1] % 2)) {
        squares[i] = 'O';
      }
    }
    return squares;
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner = calculateWinner(squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function get2D(i) {
  let row = Math.floor(i / 8);
  let column = i % 8;

  return [row, column];
}

function get1D(row, col) {
  return row * 8 + col;
}

export default Game;