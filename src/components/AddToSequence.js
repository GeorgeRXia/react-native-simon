import React from 'react';


function AddToSequenceAndRound (props){
  let addToSequence = Math.floor((Math.random()*4)+1)
  console.log(props.computerSequence);
  let newSequence  = props.computerSequence
   newSequence.push(addToSequence)
  props.computerMove(newSequence)

}

export default AddToSequenceAndRound
