import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();;
    let xWins = JSON.parse(localStorage.getItem('xSave'));
    let oWins = JSON.parse(localStorage.getItem('oSave'));
    let dWins = JSON.parse(localStorage.getItem('dSave'));
    let xc = JSON.parse(localStorage.getItem('xColor'));
    let oc = JSON.parse(localStorage.getItem('oColor'));
    let dc = JSON.parse(localStorage.getItem('dColor'));


    this.state = {
      winner: undefined,
      color: 'green',
      myDiff: 'Easy'
    };
    this.gameState = {
        turn: 'X',
        gameLocked: false,
        gameEnded: false,
        board: Array(9).fill(''),
        totalMoves: 0,
        xWins: xWins,
        oWins: oWins,
        draws: dWins,
        xColor: xc,
        oColor: oc,
        dColor: dc,
        difficulty: 'easy',
        divColor: Array(9).fill('green')
    }
    if(xWins>oWins+2){
      this.gameState.difficulty="hard";
      this.state={
        myDiff: 'Hard'
      }
    }
  }

  clicked(box){
    if(this.gameState.gameEnded || this.gameState.gameLocked) return;
    var cl=this.state.color;
    if(cl=="red"){
      cl="green";
      this.setState({
        color: 'green'
      });
    }else{ 
      this.setState({
        color: 'red'
      });
      cl="red";}
    this.gameState.divColor[box.dataset.square]=cl;

    if(this.gameState.board[box.dataset.square] === '') {
      this.gameState.board[box.dataset.square] = this.gameState.turn;
      box.innerText = this.gameState.turn;
      this.gameState.turn = this.gameState.turn === 'X' ? 'O' : 'X';      
      this.gameState.totalMoves++;
    }
    var result = this.checkWinner();
    
    if(result) this.processWinner(result);
    this.computer();
    
  }

  smart(){
    let smartMoves = [[0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6], [0, 1, 2], [3, 4, 5], [6, 7, 8]];
    let smartBoard = this.gameState.board;
    for(let i=0;i<smartMoves.length;i++) {
      if((smartBoard[smartMoves[i][0]] === smartBoard[smartMoves[i][1]] &&  smartBoard[smartMoves[i][1]]!=='' && smartBoard[smartMoves[i][1]]!=='O')
        || (smartBoard[smartMoves[i][1]] === smartBoard[smartMoves[i][2]] && smartBoard[smartMoves[i][1]]!=='' && smartBoard[smartMoves[i][1]]!=='O')){

        if(smartBoard[smartMoves[i][0]] === smartBoard[smartMoves[i][1]]){ 
          if(smartBoard[smartMoves[i][2]]==='')
          return  smartMoves[i][2];
        }else if(smartBoard[smartMoves[i][1]] === smartBoard[smartMoves[i][2]]){ 
          if(smartBoard[smartMoves[i][0]]==='')
          return smartMoves[i][0];
        }else{ 
          if(smartBoard[smartMoves[i][1]]==='')
          return  smartMoves[i][1];}
      }
    }
    return "error";
  }

  computer(){
    var diff=this.gameState.difficulty;
    if(diff==="hard"){
      var item=this.smart();
    }

    if(this.gameState.turn === 'O' && !this.gameState.gameEnded) {
      this.gameState.gameLocked = true;
      if(diff==="easy" || item==="error"){
        do {
          var random = Math.floor(Math.random()*9);
        } while(this.gameState.board[random] !== '');
      }
        this.gameState.gameLocked = false;
        if(diff==="hard" && item!=="error"){
          random=item;
        }
        this.clicked(document.querySelectorAll('.square')[random]);
    }
  }

  

  processWinner(result){
    if(result === 'X') {
      this.gameState.gameEnded = true;
      this.setState({
        winner: 'X',
        winnerLine: 'Match won by X',
        color: 'red'
      });
      localStorage.setItem('xColor',JSON.stringify('red'));
      localStorage.setItem('oColor',JSON.stringify('White'));
      localStorage.setItem('dColor',JSON.stringify('white'));
      this.gameState.xWins++
    } else if(result === 'O') {
      this.gameState.gameEnded = true;
      this.setState({
        winner: 'O',
        winnerLine: 'Match won by O',
        color: 'red'
      });
      localStorage.setItem('oColor',JSON.stringify('red'));
      localStorage.setItem('xColor',JSON.stringify('White'));
      localStorage.setItem('dColor',JSON.stringify('white'));
      this.gameState.oWins++
    } else if(result === 'draw') {
      this.gameState.gameEnded = true;
      this.setState({
        winner: '!',
        winnerLine: 'Match is drawn',
        color: 'red'
      });
      localStorage.setItem('dColor',JSON.stringify('red'));
      localStorage.setItem('oColor',JSON.stringify('White'));
      localStorage.setItem('xColor',JSON.stringify('white'));
      this.gameState.draws++
    }
    localStorage.setItem('xSave',JSON.stringify(this.gameState.xWins));
    localStorage.setItem('oSave',JSON.stringify(this.gameState.oWins));
    localStorage.setItem('dSave',JSON.stringify(this.gameState.draws));
    setTimeout(()=>{
      window.location.reload(1);
    },2500);
  }
  ChangeDiff(){
    if(this.gameState.difficulty==="hard"){
      this.gameState.difficulty="easy";
      this.setState({
        myDiff: 'Easy'
      });
    }else{
      this.gameState.difficulty="hard";
      this.setState({
        myDiff: 'Hard'
      });
    }
  }
  reset(){
    localStorage.setItem('xSave',JSON.stringify(0));
    localStorage.setItem('oSave',JSON.stringify(0));
    localStorage.setItem('dSave',JSON.stringify(0));
    window.location.reload(1);
  }

  checkWinner() {
    var moves = [[0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6], [0, 1, 2], [3, 4, 5], [6, 7, 8]];
    var board = this.gameState.board;
    for(let i=0;i<moves.length;i++) {
      if(board[moves[i][0]] === board[moves[i][1]] && board[moves[i][1]] === board[moves[i][2]])
          return board[moves[i][0]];
    }
    if(this.gameState.totalMoves === 9) {
      return 'draw';
    }
  }

  render() {
    return (
      <div>
        <div className="app-header" align="center">
                Sample ReactJS Learning Project by Aashish Gahlawat
                <h6>*Please wait for computer to choose</h6>
                <h6>Last match winner is red marked</h6>
                <table cellSpacing="20">
                <tbody>
                <tr><td></td><td>Score Board</td></tr>
                <tr>
                <td style={{color: this.gameState.xColor}}>Player Wins: {this.gameState.xWins}</td>
                <td style={{color: this.gameState.oColor}}>CPU wins: {this.gameState.oWins}</td>
                <td style={{color: this.gameState.dColor}}>Draws: {this.gameState.draws}</td>
                </tr>
                </tbody>
                </table>
                <div id="status" style={{color: this.state.color}}><h1>{this.state.winnerLine}</h1></div>
        </div><br/><br/>

          <div id="game">
          
          <div id="board" onClick={(e)=>this.clicked(e.target)}>
              <div className="square" style={{color: this.gameState.divColor[0]}} data-square="0"></div>
              <div className="square" style={{color: this.gameState.divColor[1]}} data-square="1"></div>
              <div className="square" style={{color: this.gameState.divColor[2]}} data-square="2"></div>
              <div className="square" style={{color: this.gameState.divColor[3]}} data-square="3"></div>
              <div className="square" style={{color: this.gameState.divColor[4]}} data-square="4"></div>
              <div className="square" style={{color: this.gameState.divColor[5]}} data-square="5"></div>
              <div className="square" style={{color: this.gameState.divColor[6]}} data-square="6"></div>
              <div className="square" style={{color: this.gameState.divColor[7]}} data-square="7"></div>
              <div className="square" style={{color: this.gameState.divColor[8]}} data-square="8"></div>
          </div>
      </div> 
      <br/>
      <div className="settings">
      <a href="https://www.linkedin.com/in/aashishgahlawat/"><img src={require('./me.png')} className="image"/></a><br/><br/><br/><br/>
      <h1 align="center" style={{color:"#fff"}}>Change Difficulty</h1><br/>
      <button className="button" onClick={()=>this.ChangeDiff()}>{this.state.myDiff}</button><br/><br/><br/>
      <h1 align="center" style={{color:"#fff"}}>Reset</h1><br/>
      <button className="button" onClick={()=>this.reset()}> Reset </button>
      </div>
      <h1 class="h1">Thankyou! for playing with us.</h1>
    </div>     
    );
  }
}
export default App;