

import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View
} from 'react-native';
import Simonwheel from './src/components/Simonwheel'
import Button from 'react-native-button'


class App extends Component {
  constructor(){
    super()
    this.state={
      game:false

    }

  this.setGame = this.setGame.bind(this);
  this.resetGame = this.resetGame.bind(this);
  }

  render() {
    if(this.state.game === false){
    return (
      <View style={style.startStyle}>

      <Button onPress={this.setGame} > Start Game </Button>
      <Simonwheel />

      </View>
    );
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
}

const style = {
  startStyle:{
    top: 40


  }


}

AppRegistry.registerComponent('Simon_react', () => App);
