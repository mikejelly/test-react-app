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
    const colour = this.props.winners.indexOf(i) >= 0 ? 'green' : this.getColour(i);
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        colour={colour}
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
      let id = i * 8 + j;
      
      row.push(this.renderSquare(i * 8 + j));
    }

    return (
      <div key={"row" + i} className="board-row">
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
        squares: Array(64).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i] || !this.canPlace(i)) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  canPlace(i) {
    if (i >= 56) {
      return true;
    }
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let coords = get2D(i);
    let below = [coords[0] + 1, coords[1]];
    return squares[get1D(below)] ? true : false;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    const winner = calculateWinner(squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={"move" + move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });


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
            winners={winner != null ? winner : []}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}


function calculateWinner(squares) {
  const lines = [
    [[0, 0], [0, 1], [0, 2], [0, 3]],
    [[0, 0], [0, -1], [0, -2], [0, -3]],
    [[0, 0], [1, 0], [2, 0], [3, 0]],
    [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
    [[0, 0], [1, 1], [2, 2], [3, 3]],
    [[0, 0], [1, -1], [2, -2], [3, -3]],
    [[0, 0], [-1, 1], [-2, 2], [-3, 3]],
    [[0, 0], [-1, -1], [-2, -2], [-3, -3]],
  ];
  for (let i = 0; i < 64; i++) {
    const coords = get2D(i);
    
    for (let j = 0; j < 8; j++) {
      let w = Array(2);
      let x = Array(2);
      let y = Array(2);
      let z = Array(2);
      w[0] = coords[0] + parseInt(lines[j][0][0]);
      w[1] = coords[1] + parseInt(lines[j][0][1]);
      x[0] = coords[0] + parseInt(lines[j][1][0]);
      x[1] = coords[1] + parseInt(lines[j][1][1]);
      y[0] = coords[0] + parseInt(lines[j][2][0]);
      y[1] = coords[1] + parseInt(lines[j][2][1]);
      z[0] = coords[0] + parseInt(lines[j][3][0]);
      z[1] = coords[1] + parseInt(lines[j][3][1]);

      if (outOfBounds(w) || outOfBounds(x) || outOfBounds(y) || outOfBounds(z)) {
        continue;
      }
      const a = get1D(w);
      const b = get1D(x);
      const c = get1D(y);
      const d = get1D(z);
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]) {
        return [a, b, c, d];
      }
    }
  }
  return null;
}

function get2D(i) {
  let row = Math.floor(i / 8);
  let column = i % 8;
  return [row, column];
}

function get1D(coords) {
  return coords[0] * 8 + coords[1];
}

function outOfBounds(coords) {
  if (coords[0] >= 8 || coords[0] < 0 || coords[1] >=8 || coords[1] < 0) {
    return true;
  }
  return false;
}

export default Game;