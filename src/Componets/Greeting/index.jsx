import React from 'react'

function Greeting(props){
  return(
      <h1 className="text-center text-white my-3">{props.greeting}</h1>
  )
}

export default Greeting;
