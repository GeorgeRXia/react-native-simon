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



class Simonwheel extends Component {
  constructor(props){
    super(props)
  this.state = {
    lit: 0,
    computerSequence: [],
    computerSequenceIndex:0,
    playerSequence: [],
    round: 1,
    startGame: props.startGame,
    playersTurn: false,
    playerScore: 0,



  };

}
render() {
    if (this.state.startGame && this.state.computerSequence.length < this.state.round){
        return <View style={styles.container} >
          {this._renderTiles()}
            {this.addToSequence()}
          </View>
    }else{
      return <View style={styles.container} >
        {this._renderTiles()}

        </View>


    }
}


// create four tiles
_renderTiles() {
  let result = [];
  let i = 1;
  let bgColors = ["", "","#3275DD", "#D93333", "#64D23B", "#FED731"];
  for (var row = 0; row < SIZE; row++) {
    for (var col = 0; col < SIZE; col++) {
      var position = {
        left: col * CELL_SIZE + CELL_PADDING,
        top: row * CELL_SIZE + CELL_PADDING
      };

      result.push(this._renderTile(i++, position, {backgroundColor: bgColors[i]}, {backgroundColor: 'black'}));

    }
  }
  return result;
}

// create one tile
_renderTile(id, position, bgColor, litBgColor) {

  return (<TouchableOpacity onPress={() => this._playTheGame(id)}>
    <View style={[styles.tile, position, this.state.lit == id ? litBgColor : bgColor]}><Text style={styles.letter}>{id}</Text>
    </View>
  </TouchableOpacity>)
}
_playTheGame(id){
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
  console.log(currentRound);
  this.setState({round: currentRound, playerSequence: [], playersTurn: false})

}

addToSequence (){

  let addToSequence = Math.floor((Math.random()*4)+1)

  let newSequence  = this.state.computerSequence
   newSequence.push(addToSequence)



  this.setState({computerSequence:newSequence})

this.animateSequence(newSequence)


}
animateSequence(newSequence){

  // let allSequence = newSequence
  // console.log(allSequence );
  // let that = this
  //
  // for(let t = 0; t<newSequence.length; t++){
  //   console.log(allSequence[t-1]);
  //   if (allSequence[t] === allSequence[t-1]){
  //     console.log("doubled up");
  //     this.setState({lit:0})
  //
  //
  //   }
  //   setTimeout(function(){
  //
  //
  //       that.setState({lit:allSequence[t]})
  //
  //   }, t * 1000);
  //   if (t >= newSequence.length) {
  //
  //     setTimeout(() => this.setState({lit: 0}), 1000);
  //   }
  //
  //
  // }
  // console.log(newSequence);
  var i = 0;
  this.intervalId = setInterval(() => {

    if (newSequence[i] === newSequence[i-1]){
      this.setState({lit: 0});

    }
    this.setState({lit: newSequence[i]});
    i++;
    if (i >= newSequence.length) {
      clearInterval(this.intervalId);
      setTimeout(() => this.setState({lit: 0}), 1000);
    }
  }, 1000)


}

clearLit(){
setTimeout(() => this.setState({lit: 0}), 10000)
}
gameOver(){

    this.props.setGame()


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

  },
  letter: {
    color: 'white',
    fontSize: LETTER_SIZE,
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS,
    textAlign: 'center',
  },

  chosen: {
    opacity: 0.5


  }
}


);


export default Simonwheel
