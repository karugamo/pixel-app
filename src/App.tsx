import React, {useState} from 'react'
import styled from 'styled-components'
import useDrag from './useDrag'
import {nanoid} from 'nanoid'
import ColorPalette from './ColorPalette'
import {useScale} from './state'
import {useDrawing} from './useDrawing'

type ArtBoard = {
  id: string
  name: string
  width: number
  height: number
  context?: CanvasRenderingContext2D
}

function AddArtBoard({add}: {add: (width: number, height: number) => void}) {
  const [width, setWidth] = useState(32)
  const [height, setHeight] = useState(32)
  return (
    <AddArtBoardContainer>
      <AddArtBordInput
        value={width}
        onChange={(e) => setWidth(Number((e.target as HTMLInputElement).value))}
      />
      <AddArtBordInput
        value={height}
        onChange={(e) =>
          setHeight(Number((e.target as HTMLInputElement).value))
        }
      />
      <button onClick={() => add(width, height)}>Add artboard</button>
    </AddArtBoardContainer>
  )
}

const AddArtBordInput = styled.input`
  width: 50px;
`

const AddArtBoardContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`

export default function App() {
  const [artboards, setArtboards] = useState<ArtBoard[]>([])
  const [nextArtBoardNumber, setNextArtBoardNumber] = useState(1)

  return (
    <Main>
      <Tools>
        <AddArtBoard add={addArtBoard} />
        <ColorPalette />
      </Tools>
      {artboards.map((artboard) => (
        <ArtBoardView key={artboard.id} {...artboard} />
      ))}
    </Main>
  )

  function addArtBoard(width: number, height: number) {
    setNextArtBoardNumber((number) => number + 1)
    setArtboards((artboards) => [
      ...artboards,
      {id: nanoid(), name: `artboard ${nextArtBoardNumber}`, width, height}
    ])
  }
}

function ArtBoardView({name, width, height}: ArtBoard) {
  const [handleRef, moveRef] = useDrag()

  const canvasRef = useDrawing()

  const [scale] = useScale()

  return (
    <ArtBoardContainer ref={moveRef}>
      <Handle ref={handleRef}>{name}</Handle>
      <Canvas
        style={{height: height * scale, width: width * scale}}
        ref={canvasRef}
        height={height}
        width={width}
      />
    </ArtBoardContainer>
  )
}

const Canvas = styled.canvas`
  background-color: white;
  cursor: crosshair;
`

const Handle = styled.div`
  cursor: move;
  user-select: none;
`

const ArtBoardContainer = styled.div`
  position: absolute;
  top: 16px;
  left: 400px;
`

const Main = styled.div`
  position: relative;
  height: 100%;

  background-color: #e5e5e5;
  color: #242422;
`

const Tools = styled.div`
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 200px;
  background-color: white;
  height: 100%;
`
