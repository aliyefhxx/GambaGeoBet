import React from "react"
import styled from "styled-components"

const Welcome = styled.div`
  background: linear-gradient(-45deg, #ffb07c, #ff3e88, #2969ff, #ef3cff, #ff3c87);
  background-size: 300% 300%;
  animation: backgroundGradient 30s ease infinite;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
`

export function WelcomeBanner() {
  return (
    <Welcome>
      <div>
        <h1>ARAFLI ELNAR AUYE </h1>
        <p>GAMBA GEO BET-თან ერთად ყოველთვის მოიგებთ! ⚡</p>
      </div>
    </Welcome>
  )
}
