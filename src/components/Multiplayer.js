import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated


} from 'react-native';


const {width, height} = require('Dimensions').get('window');
const SIZE = 2; // two-by-two grid
const CELL_SIZE = Math.floor(width * .4); // 20% of the screen width
const CELL_PADDING = Math.floor(CELL_SIZE * .02); // 5% of the cell size
const BORDER_RADIUS = CELL_PADDING * 2;
const TILE_SIZE = CELL_SIZE - CELL_PADDING * 2;
const LETTER_SIZE = 50;



class Multiplayer extends Component {
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
    gameStatus:""

  };

}
componentWillMount(){

  this.ws = new WebSocket('ws://localhost:3001');

  this.ws.onopen = this.onOpenConnection;
  this.ws.onmessage = this.onScoreReceived;
  this.ws.onerror = this.onError;
  this.ws.onclose = this.onClose;
  this.addToSequence()
}

onOpenConnection = () =>{
  console.log("open");


}

onScoreReceived = (event) =>{
  console.log("score received");
  console.log( event.data);
  this.setState({

    history: event.data
    // history : [
    //   ...this.state.history, {owner: false, score: event.data}
    //
    // ],



  })

  this.setState({

    history: event.data,
    gameStatus: "done"



  })



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
this.ws.send(JSON.stringify(score));




if(status === "done"){
  this.setState({
    gameStatus: "done"


  })

}

}




render() {
if(this.state.gameStatus === ""){
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

else{
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

      }else {

        this.gameOver();

      }

      if (computerSequence.length === playerSequence.length){

        this.addToRound()

      }


    }

addToRound(){

  let currentRound = this.state.round;
  currentRound ++;
  let score = 100 * currentRound;
  var that = this;
  this.setState({round: currentRound, playerSequence: [], score: score},function(){that.onSendScore()});


  this.addToSequence();

// this.onSendScore();
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


//   var i = 0;
// var that = this
//   this.intervalId = setInterval(() => {
//     if (newSequence[i] === newSequence[i-1]) {
//       console.log("double up");
//       this.setState({lit:0})
//
//       setTimeout(function(){
//
//           that.setState({lit:newSequence[i]})
//
//       }, 1000)
//
//       i++
//     }else{
//
//
//
//       that.setState({lit: newSequence[i]})
//
//
//     i++;
//   }
//     if (i >= newSequence.length) {
//       clearInterval(this.intervalId);
//       setTimeout(() => this.setState({lit: 0}), 1000);
//     }
//   }, 1000)


}
gameOver(){
  var that = this;
  // this.setState({gamestatus: "done"}, function(){
  //   that.gameStatus();
  //
  // })

    setTimeout(function(){that.props.setGame()}, 3000)
this.onSendScore("done");
// this.props.setGame()
}

gameStatus(){

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


export default Multiplayer
