import React, {
  Component
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated
} from 'react-native';
import axios from 'axios';


const {
  width,
  height
} = require('Dimensions').get('window');
const SIZE = 2;
const CELL_SIZE = Math.floor(width * .4);
const CELL_PADDING = Math.floor(CELL_SIZE * .02);
const BORDER_RADIUS = CELL_PADDING * 2;
const TILE_SIZE = CELL_SIZE - CELL_PADDING * 2;
const LETTER_SIZE = 50;


class RoundsMatchingMultiplayer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lit: 0,
      computerSequence: [],
      playerSequence: [],
      round: 1,
      startGame: props.startGame,
      opponentsGameStatus: "",
      ownGameStatus: "",
      gameSetter: "",
      opponentInGame: "",
      turn: "",
      points: 0,
      opponentsPoints:0,
      speed: 1


    };

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
      axios.post('http://localhost:3000/games',{
        data:{
            user_id: 2

        }
      }).then(function(response){
        console.log(response.data);
        that.setState({opponentInGame: response.data, turn: "original"},function(){;
        if (response.data){
        that.addToSequence();
      }
    })
    })

  this.setTimeOut()


    }

    otherPlayer(){
      var that = this;

      axios.get('http://localhost:3000/games').then(function(response){

        that.setState({opponentInGame: response.data});
      })
    }

  onOpenConnection = () =>{
    console.log("open");


  }

  onScoreReceived = (event) =>{

  console.log(event.data);

   let receivedEvent = JSON.parse(event.data)
   var that = this;

  if(receivedEvent.gameStatus === "done"){
    this.setState({opponentsGameStatus: receivedEvent.gameStatus,
      computerSequence: receivedEvent.computerSequence
    },function(){
      that.animateSequence(receivedEvent.computerSequence)})



  }else if(receivedEvent.turn === "other"){

    this.setState({computerSequence: receivedEvent.computerSequence, turn: receivedEvent.turn, opponentsPoints: receivedEvent.points},function(){
      that.animateSequence(receivedEvent.computerSequence);

    })



  }else if(receivedEvent.turn === "original"){
    this.setState({opponentsPoints: receivedEvent.points});
    this.addToRound();

  } else if(receivedEvent.gameStatus === "loser" || receivedEvent.gameStatus === "winner" ||receivedEvent.gameStatus === "tie" ){

    this.setState({gameSetter: receivedEvent.gameStatus})

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
      ownGameStatus: "done" })
      let game = {gameStatus: "done", computerSequence: computerSequence}

      this.ws.send(JSON.stringify(game));
    }else if(status === "original"){

    let game = {turn: "original", computerSequence: computerSequence, points: this.state.points};
    this.ws.send(JSON.stringify(game));
  }else if (status === "loser"){
      let game = {gameStatus: "loser"}
      this.ws.send(JSON.stringify(game));
  }else if (status === "winner"){
    console.log("it got into the winner part");
    let game = {gameStatus: "winner"}
    this.ws.send(JSON.stringify(game));

  }else if (status === "tieGame") {

    let game = {gameStatus: "tie"}
  this.ws.send(JSON.stringify(game));

  }else{

    let game = {turn: "other", computerSequence: computerSequence, points: this.state.points};
  this.ws.send(JSON.stringify(game));


  }

  }




  render() {
  if(this.state.gameSetter === "winner" || this.state.gameSetter === "loser" || this.state.gameSetter === "tie"){

    return (
      <View>

      {this.gameStatus(this.state.gameSetter)}

      <View style={styles.container} >

      {this.renderTiles()}

      </View>

      </View>
    )


  }else if (this.state.ownGameStatus === "done"){
    return (
      <View>

      <Text style={styles.score}> {this.state.round} </Text>
        <Text style={styles.score}> {this.state.points} </Text>
          <Text style={styles.score}> {this.state.opponentsPoints} </Text>
      <View style={styles.container} >

      {this.renderTiles()}

      </View>

      </View>
    )

  }else{
        return (
          <View>
          <Text style={styles.score}>{this.state.round} </Text>
          <Text style={styles.score}> {this.state.points} </Text>
            <Text style={styles.score}> {this.state.opponentsPoints} </Text>
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
    console.log(playerSequence);
      this.setState({playerSequence: playerSequence})
      if (computerSequence.length === playerSequence.length){

         if (this.state.turn === "other"){
           console.log("it is in the other");
          let currentRound = this.state.round;

          let points = 100 * currentRound + this.state.points;
          currentRound++;
          var that = this;
          this.setState({round: currentRound, playerSequence: [], points: points},function(){
            console.log(that.state.points);
              console.log(that.state.opponentsPoints);
              let status = "";
              let ownStatus = "";
            if(that.state.round === 4){
                if(that.state.points > this.state.opponentsPoints){
                  status = "loser";
                  ownStatus = "winner";
                }else if(that.state.points < this.state.opponentsPoints){
                  status  = "winner";
                  ownStatus = "loser";
                }else{
                  status = "tieGame";
                  ownStatus = "tie"
                }
                this.setState({gameSetter: ownStatus},function(){
                    that.onSendScore(status)

                })


            }else{
              that.onSendScore("original");

            }

          });


          }else{
            console.log("it will now update score");
            let points = 100 * this.state.round + this.state.points;
              console.log(points);
            this.setState({points: points},function(){
                this.onSendScore();
            })


          }
      }

   }else {
     var that = this;
      if (this.state.turn === "other"){
      let currentPoints = this.state.points;
      let currentRound = this.state.round;
      currentRound ++;
      let points = currentPoints - 100;
      var that = this;
      this.setState({round: currentRound, playerSequence: [], points: points},function(){
        if(that.state.round === 4){

          if(that.state.points > this.state.opponentsPoints){
            status = "winner";
            ownStatus = "loser";
          }else if(that.state.points < this.state.opponentsPoints){
            status  = "loser";
            ownStatus = "winner";
          }else{
            status = "tieGame";
            ownStatus = "tie"
          }
          this.setState({gameSetter: ownStatus})
          that.onSendScore(status)

        }else{

          that.onSendScore("original");
        }
      });


      }else{
        console.log("it will now update score");
        let currentPoints = this.state.points;
        let points = currentPoints - 100;
        this.setState({points: points},function(){
          if(that.state.round === 4){

            if(that.state.points > this.state.opponentsPoints){
              status = "winner";
              ownStatus = "loser";
            }else if(that.state.points < this.state.opponentsPoints){
              status  = "loser";
              ownStatus = "winner";
            }else{
              status = "tieGame";
              ownStatus = "tie"
            }
            this.setState({gameSetter: ownStatus})
            that.onSendScore(status)

          }else{
            this.onSendScore();
          }
        })


      }
   }



  }

  addToRound(){

    let currentRound = this.state.round;
    currentRound ++;

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


    let speed = (this.state.speed - (this.state.round * 0.19));
    var that = this;
    for(let i = 0; i<newSequence.length; i++){

        setTimeout(function(){

          setTimeout(function(){
            that.setState({lit: newSequence[i]})
          }, 800)

          if(newSequence[i] === newSequence[i-1]){

            setTimeout(function(){

              that.setState({lit:0})

          },990)

          }else{
          setTimeout(function(){
            that.setState({lit: 0})

          },1000)
        }


      }, speed * i * 1000);


    }

  }
  turnOver(){
    this.onSendScore("done");

  }
  tieGame(){
    this.setState({gameSetter:"tie"})
    this.onSendScore("tieGame");

  }

  gameStatus(status){

      if(status === "winner"){
        return this.gameMessage(" Win");


      }else if (status === "tie"){
        return this.gameMessage(" tied");


      }else{

          return this.gameMessage(" lose");

      }
  }

  gameMessage(status){
    return <Text style={styles.score}> You {status} </Text>


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


  export default RoundsMatchingMultiplayer;
