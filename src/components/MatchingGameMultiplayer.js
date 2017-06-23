import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated
} from 'react-native';
import axios from 'axios';


const {width, height} = require('Dimensions').get('window');
const SIZE = 2;
const CELL_SIZE = Math.floor(width * .4);
const CELL_PADDING = Math.floor(CELL_SIZE * .02);
const BORDER_RADIUS = CELL_PADDING * 2;
const TILE_SIZE = CELL_SIZE - CELL_PADDING * 2;
const LETTER_SIZE = 50;


class MatchingGameMultiplayer extends Component {
  constructor(props){
    super(props)
  this.state = {
    lit: 0,
    computerSequence: [],
    playerSequence: [],
    round: 1,
    startGame: props.startGame,
    opponentsGameStatus:"",
    ownGameStatus:"",
    GameSetter:"",
    opponentInGame:""

  };
  this.otherPlayer = this.otherPlayer.bind(this)
}
startWs(){

  this.ws = new WebSocket('ws://localhost:3001');

  this.ws.onopen = this.onOpenConnection;
  this.ws.onmessage = this.onScoreReceived;
  this.ws.onerror = this.onError;
  this.ws.onclose = this.onClose;



}
setTimeOut(){
var that = this;

  this.intervalPlayer = setInterval(() => {

    this.otherPlayer();
      console.log("This is looping");

      if(that.state.opponentInGame === true){
        that.startWs();
        clearInterval(that.intervalPlayer);

      }


  }, 1000)



}

  componentWillMount(){

      var that = this;

    console.log("it is in axios mount");
    axios.post('http://localhost:3000/games',{
      data:{
          user_id: 2

      }
    }).then(function(response){
      console.log(response.data);
      that.setState({opponentInGame: response.data},function(){;
      if (response.data){
      that.addToSequence();
    }
  })
  })

this.setTimeOut()




  }

  otherPlayer(){
    var that = this;
    console.log("hey");
    axios.get('http://localhost:3000/games').then(function(response){
      console.log(response.data);
      that.setState({opponentInGame: response.data});
    })
  }

onOpenConnection = () =>{
  console.log("open");


}

onScoreReceived = (event) =>{

console.log(event.data);




  console.log("score received");
 let receivedEvent = JSON.parse(event.data)
 var that = this;

if(receivedEvent.gameStatus === "done"){
  this.setState({


    opponentsGameStatus: receivedEvent.gameStatus

  })



}else if(receivedEvent.turn === "other"){
  var that = this;
  this.setState({computerSequence: receivedEvent.computerSequence, turn: receivedEvent.turn},function(){
    that.animateSequence(receivedEvent.computerSequence);

  })



}else if(receivedEvent.turn === "original"){
  this.addToRound();

}else{
  this.setState({
    history: event.data

  })

}


}
onError = (event) => {
  console.log("onerror", event.message);

}

onClose = (event) => {

console.log("onclose", event.code, event.reason);

}

onSendScore = (status) => {
console.log(status);


let computerSequence = this.state.computerSequence;


if(status === "done"){
  this.setState({
    ownGameStatus: "done"  },function(){


    })
    let game = {gameStatus: "done", computerSequence: computerSequence}

    this.ws.send(JSON.stringify(game));
}else if(status === "original"){

  let game = {turn: "original", computerSequence: computerSequence}
  this.ws.send(JSON.stringify(game));
}else{

  let game = {turn: "other", computerSequence: computerSequence}
this.ws.send(JSON.stringify(game));


}

}




render() {
if(this.state.ownGameStatus === "done" && this.state.opponentsGameStatus === "done"){

  return (
    <View>

    <Text style={styles.score}> {this.state.round} </Text>

    <View style={styles.container} >

    {this.renderTiles()}

    </View>
{this.gameStatus()}
    </View>
  )


}else if (this.state.ownGameStatus === "done"){
  return (
    <View>

    <Text style={styles.score}> {this.state.round} </Text>

    <View style={styles.container} >

    {this.renderTiles()}

    </View>

    </View>
  )

}else{
      return (
        <View>
        <Text style={styles.score}>{this.state.round} </Text>


        <View style={styles.container} >

        {this.renderTiles()}

        </View>

        </View>
      )

    }

}

renderTiles() {
  let result = [];
  let i = 1;
  let bgColors = ["", "","#3275DD", "#D93333", "#64D23B", "#FED731"];
  for (var row = 0; row < SIZE; row++) {
    for (var col = 0; col < SIZE; col++) {
      var position = {
        left: col * CELL_SIZE + CELL_PADDING,
        top: row * CELL_SIZE + CELL_PADDING
      };

      result.push(this.renderTile(i++, position, {backgroundColor: bgColors[i]}, {backgroundColor: 'black'}));

    }
  }
  return result;
}


renderTile(id, position, bgColor, litBgColor) {

  return (<TouchableOpacity onPress={() => this.playTheGame(id)}>
    <View style={[styles.tile, position, this.state.lit == id ? litBgColor : bgColor]}><Text style={styles.letter}>{id}</Text>
    </View>
  </TouchableOpacity>)
}
playTheGame(id){
      let computerSequence = this.state.computerSequence;
console.log(computerSequence);
      let playerSequence = this.state.playerSequence;
      playerSequence.push(id)


      let i = playerSequence.length - 1;

     if(computerSequence[i] === playerSequence[i] ){

        this.setState({playerSequence: playerSequence})
        if (computerSequence.length === playerSequence.length){

          if(this.state.turn === "other"){
            let currentRound = this.state.round;
            currentRound ++;

            var that = this;
            this.setState({round: currentRound, playerSequence: []});


            this.onSendScore("original");

          }else{

            this.onSendScore();

          }

        }

      }else {
console.log("Gameover");
        this.gameOver();

      }

    }

addToRound(){

  let currentRound = this.state.round;
  currentRound ++;
  var that = this;
  this.setState({round: currentRound, playerSequence: []});


  this.addToSequence();
}

addToSequence (){

  let addToSequence = Math.floor((Math.random()*4)+1)
  let newSequence  = this.state.computerSequence
  newSequence.push(addToSequence)

  this.setState({computerSequence:newSequence})
  console.log(newSequence);
  this.animateSequence(newSequence)

}
animateSequence(newSequence){
  console.log("It comes into animate sequence");
  var that = this
  for(let i = 0; i<newSequence.length; i++){

      setTimeout(function(){

        setTimeout(function(){
          that.setState({lit: newSequence[i]})
        }, 800)

        if(newSequence[i] === newSequence[i-1]){
          console.log("double up");
          setTimeout(function(){

            that.setState({lit:0})

        },990)

        }else{
        setTimeout(function(){
          that.setState({lit: 0})

        },1000)
      }


      }, i * 1000);


  }

}
gameOver(){
  var that = this;
  this.onSendScore("done");

}

gameStatus(){
  // var that = this;
  // setTimeout(function(){  that.props.setGame()}, 4000);
  //
  //   if(){
  //     return this.gameMessage(" Win");
  //
  //   }else if(this.state.score < this.state.history){
  //     return this.gameMessage(" Lose");
  //
  //   }else if (this.state.score === this.state.history){
  //
  //       return this.gameMessage(" Tied");
  //
  //   }else{
  //
  //       return this.gameMessage(" are playing");
  //
  //   }
}

gameMessage(status){
  return <Text> You {status} </Text>


}

}


var styles = StyleSheet.create({
  container: {
    width: CELL_SIZE * SIZE,
    height: CELL_SIZE * SIZE,
    backgroundColor: 'transparent',
  },
  tile: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10

  },
  letter: {
    color: 'white',
    fontSize: LETTER_SIZE,
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS,
    textAlign: 'center'
  },

  score: {
    top: 10,
    color: 'black',
    fontSize: 50


  }

}


);


export default MatchingGameMultiplayer
