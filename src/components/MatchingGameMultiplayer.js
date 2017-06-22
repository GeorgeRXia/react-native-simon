import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated
} from 'react-native';


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
    computerSequenceIndex:0,
    playerSequence: [],
    round: 1,
    startGame: props.startGame,
    score: 0,
    history:"",
    opponentsGameStatus:"",
    ownGameStatus:"",
    GameSetter:""

  };

}
componentWillMount(){

  this.ws = new WebSocket('ws://localhost:3001');

  this.ws.onopen = this.onOpenConnection;
  this.ws.onmessage = this.onScoreReceived;
  this.ws.onerror = this.onError;
  this.ws.onclose = this.onClose;

  this.addToSequence();

}

componentDidMount(){



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

    history: receivedEvent.score,
    opponentsGameStatus: receivedEvent.gameStatus

  })



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
console.log("sent it");


let score = this.state.score;


if(status === "done"){
  this.setState({
    ownGameStatus: "done"  },function(){


    })
    let game = {gameStatus: "done" ,score: score}

    this.ws.send(JSON.stringify(game));
}else{


this.ws.send(JSON.stringify(score));


}

}




render() {
if(this.state.ownGameStatus === "done" && this.state.opponentsGameStatus === "done"){

  return (
    <View>
    <Text style={styles.score}>{this.state.history} </Text>
    <Text style={styles.score}> {this.state.score} </Text>

    <View style={styles.container} >

    {this.renderTiles()}

    </View>
{this.gameStatus()}
    </View>
  )


}else if (this.state.ownGameStatus === "done"){
  return (
    <View>
    <Text style={styles.score}>{this.state.history} </Text>
    <Text style={styles.score}> {this.state.score} </Text>

    <View style={styles.container} >

    {this.renderTiles()}

    </View>

    </View>
  )

}else{
      return (
        <View>
        <Text style={styles.score}>{this.state.history} </Text>
        <Text style={styles.score}> {this.state.score} </Text>

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

      let playerSequence = this.state.playerSequence;
      playerSequence.push(id)


      let i = playerSequence.length - 1;

     if(computerSequence[i] === playerSequence[i] ){

        this.setState({playerSequence: playerSequence})
        if (computerSequence.length === playerSequence.length){

          this.addToRound()

        }

      }else {

        this.gameOver();

      }

    }

addToRound(){

  let currentRound = this.state.round;
  currentRound ++;
  let score = 100 * currentRound;
  var that = this;
  this.setState({round: currentRound, playerSequence: [], score: score},function(){that.onSendScore()});


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
  var that = this;
  setTimeout(function(){  that.props.setGame()}, 4000);

    if(this.state.score > this.state.history){
      return this.gameMessage(" Win");

    }else if(this.state.score < this.state.history){
      return this.gameMessage(" Lose");

    }else if (this.state.score === this.state.history){

        return this.gameMessage(" Tied");

    }else{

        return this.gameMessage(" are playing");

    }
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
