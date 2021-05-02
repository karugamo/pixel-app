import React, {useState} from 'react'
import styled from 'styled-components'
import useDrag from './useDrag'
import {nanoid} from 'nanoid'

type ArtBoard = {
  id: string
}

export default function App() {
  const [artboards, setArtboards] = useState<ArtBoard[]>([])

  return (
    <Main>
      <button onClick={addArtBoard}>Add artboard</button>
      {artboards.map((artboard) => (
        <ArtBoardView key={artboard.id} />
      ))}
    </Main>
  )

  function addArtBoard() {
    setArtboards((artboards) => [...artboards, {id: nanoid()}])
  }
}

function ArtBoardView() {
  const ref = useDrag()
  return <ArtBoardContainer ref={ref} />
}

const ArtBoardContainer = styled.div`
  width: 128px;
  height: 128px;
  position: absolute;
  background-color: white;
  top: 0px;
  left: 0px;
`

const Main = styled.div`
  position: relative;
  height: 100%;

  background-color: #e5e5e5;
  color: #242422;
`
