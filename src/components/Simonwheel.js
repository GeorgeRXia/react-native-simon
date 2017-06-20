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
    playerScore: 0,



  };

}
render() {
    if (this.state.startGame && this.state.computerSequence.length < this.state.round){
        return <View style={styles.container} >
          {this.renderTiles()}
            {this.addToSequence()}
          </View>
    }else{
      return <View style={styles.container} >
        {this.renderTiles()}

        </View>


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
  console.log(currentRound);
  this.setState({round: currentRound, playerSequence: []})

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
