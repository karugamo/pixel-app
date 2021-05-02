import React, {useEffect, useRef, useState} from 'react'
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
  const [handleRef, moveRef] = useDrag()

  const [canvasRef, context] = useDrawingContext()

  const scale = 4
  console.log(window.devicePixelRatio)

  return (
    <ArtBoardContainer ref={moveRef}>
      <Handle ref={handleRef}>artboard</Handle>
      <Canvas
        onClick={onDraw}
        style={{height: 128, width: 128}}
        ref={canvasRef}
        height={128 / scale}
        width={128 / scale}
      />
    </ArtBoardContainer>
  )

  function onDraw(e) {
    const rect = e.target.getBoundingClientRect()
    const x = Math.round((e.clientX - rect.left) / scale)
    const y = Math.round((e.clientY - rect.top) / scale)
    context?.fillRect(x, y, 1, 1)
  }
}

function useDrawingContext() {
  const canvasRef = useRef(null)
  const [context, setContext] = useState<any>()

  useEffect(() => {
    const context = canvasRef.current.getContext('2d')
    setContext(context)
  }, [])

  return [canvasRef, context]
}

const Canvas = styled.canvas`
  height: 128px;
  width: 128px;
  background-color: white;
`

const Handle = styled.div`
  cursor: move;
  user-select: none;
`

const ArtBoardContainer = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
`

const Main = styled.div`
  position: relative;
  height: 100%;

  background-color: #e5e5e5;
  color: #242422;
`
