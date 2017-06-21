

import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View
} from 'react-native';
import Simonwheel from './src/components/Simonwheel';
import Multiplayer from './src/components/Multiplayer';
import Button from 'react-native-button';


class App extends Component {
  constructor(){
    super()
    this.state={
      game:false,
      multiplayer: false

    }

  this.setGame = this.setGame.bind(this);
  this.resetGame = this.resetGame.bind(this);
  this.setMultiplayer = this.setMultiplayer.bind(this);
  }

  render() {
    if(this.state.game === false){
    return (
      <View style={style.startStyle}>

      <Button onPress={this.setGame} > Start Game </Button>
      <Button onPress={this.setMultiplayer} > Multiplayer</Button>
  

      </View>
    );
  }else if(this.state.multiplayer === true){

return(
    <Multiplayer startGame={this.state.game} setGame= {this.resetGame} />

)



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
}

const style = {
  startStyle:{
    top: 40


  }


}

AppRegistry.registerComponent('Simon_react', () => App);
