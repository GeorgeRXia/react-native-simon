

import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View
} from 'react-native';
import Simonwheel from './src/components/Simonwheel';
import Multiplayer from './src/components/Multiplayer';
import MatchingGameMultiplayer from './src/components/MatchingGameMultiplayer';
import RoundsMatchingMultiplayer from './src/components/RoundsMatchingMultiplayer';
import Button from 'react-native-button';


class App extends Component {
  constructor(){
    super()
    this.state={
      game:false,
      multiplayer: false,
      matchingGameMultiplayer: false

    }

  this.setGame = this.setGame.bind(this);
  this.resetGame = this.resetGame.bind(this);
  this.setMultiplayer = this.setMultiplayer.bind(this);
  this.matchingGameMultiplayer = this.matchingGameMultiplayer.bind(this);
  this.roundMatchingMultiplayer = this.roundMatchingMultiplayer.bind(this);
  }

  render() {
    if(this.state.game === false){
    return (
      <View style={style.startStyle}>

      <Button onPress={this.setGame} > Start Game </Button>
      <Button onPress={this.setMultiplayer} > Multiplayer</Button>
      <Button onPress={this.matchingGameMultiplayer}> Matching Game Multiplayer </Button>
      <Button onPress={this.roundMatchingMultiplayer}> Rounds Matching Game Multiplayer </Button>
      </View>
    );
  }else if(this.state.multiplayer === true){

return(
    <Multiplayer startGame={this.state.game} setGame= {this.resetGame} />

)



  }else if (this.state.matchingGameMultiplayer === true){

    return <MatchingGameMultiplayer startGame={this.state.game} setGame= {this.resetGame}/>


  }else if(this.state.roundMatchingMultiplayer === true){

    return <RoundsMatchingMultiplayer startGame={this.state.game} setGame= {this.resetGame}/>

 }else{
    return   <Simonwheel startGame={this.state.game} setGame= {this.resetGame}/>


  }
  }
  setGame(state){

    this.setState({game: true })


  }
  resetGame(){

    this.setState({game: false })

  }
  setMultiplayer(){
    this.setState({multiplayer: true, game: true})


  }
  matchingGameMultiplayer(){
    this.setState({matchingGameMultiplayer: true, game: true})

  }
  roundMatchingMultiplayer(){

    this.setState({roundMatchingMultiplayer: true, game: true})

  }

}

const style = {
  startStyle:{
    top: 40


  }


}

AppRegistry.registerComponent('Simon_react', () => App);
