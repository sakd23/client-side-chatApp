import React from 'react'
import styled from 'styled-components'
import Robot from '../assets/robot.gif'
function Welcome({currentUser}) {
  return (
    <Container>
      <img src={Robot} alt='robot'></img>
      <h1>Bonjour <span>{currentUser.username}</span></h1>
      <h3>Please select a chat to start Messaging</h3>
    </Container>
  )
}
const Container=styled.div `
display: flex;
justify-content: center;
align-items: center;
color: white;
flex-direction: column;
img{
    height: 20rem;
}
span{
    color: greenyellow;
}
`
export default Welcome
