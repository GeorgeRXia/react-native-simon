import React from 'react';


function AnimateSequence(props){

  let allSequence = props.computerSequence

  allSequence.forEach(function(sequence, index){
    let highLight = document.getElementById(sequence);


    setTimeout(function(){


      setTimeout(function(){
        highLight.classList.add("highlight")
      }, 800)

      if(sequence === allSequence[index-1]){
        console.log("double up");
        setTimeout(function(){highLight.classList.remove("highlight")

      },990)

      }else{
      setTimeout(function(){
        highLight.classList.remove("highlight")

      },1000)
    }


    }, index * 1000);
    // highLight.classList.add("highlight");

    console.log(highLight);




  })




return null

}

export default AnimateSequence
