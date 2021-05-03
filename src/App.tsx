import React, {useState} from 'react'
import styled from 'styled-components'
import useDrag from './useDrag'
import {nanoid} from 'nanoid'
import ColorPalette from './ColorPalette'
import {Tool, useCurrentTool, useScale} from './state'
import {useDrawing} from './useDrawing'

export default function App() {
  const [artboards, setArtboards] = useState<ArtBoard[]>([])
  const [nextArtBoardNumber, setNextArtBoardNumber] = useState(1)
  const [, setCurrentTool] = useCurrentTool()
  const [scale, setScale] = useScale()

  return (
    <Main>
      <Tools>
        <AddArtBoard add={addArtBoard} />
        <ToolEntry>
          scale{' '}
          <Input
            type="number"
            value={scale}
            onChange={(e) =>
              setScale(Number((e.target as HTMLInputElement).value))
            }
          />
        </ToolEntry>
        <ColorPalette />
        <button onClick={() => setCurrentTool(Tool.Pencil)}>pencil</button>
        <button onClick={() => setCurrentTool(Tool.Rectangle)}>
          rectangle fill
        </button>
        <button onClick={() => setCurrentTool(Tool.RectangleOutline)}>
          rectangle outline
        </button>
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
      <Handle ref={handleRef}>
        {name} ({width}x{height})
      </Handle>
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
    <ToolEntry>
      <Input
        type="number"
        value={width}
        onChange={(e) => setWidth(Number((e.target as HTMLInputElement).value))}
      />
      <Input
        type="number"
        value={height}
        onChange={(e) =>
          setHeight(Number((e.target as HTMLInputElement).value))
        }
      />
      <button onClick={() => add(width, height)}>Add artboard</button>
    </ToolEntry>
  )
}

const Input = styled.input`
  width: 50px;
`

const ToolEntry = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`
