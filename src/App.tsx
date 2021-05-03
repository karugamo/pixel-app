import React, {Suspense, useState} from 'react'
import styled from 'styled-components'
import useDrag from './useDrag'
import {nanoid} from 'nanoid'
import ColorPalette from './ColorPalette'
import {
  Tool,
  useCurrentTool,
  useImageData,
  usePosition,
  useScale
} from './state'
import {useDrawing} from './useDrawing'
import {Artboard} from './types'
import {useArtboards} from './firebase'

export default function App() {
  const [nextArtBoardNumber, setNextArtBoardNumber] = useState(1)
  const [, setCurrentTool] = useCurrentTool()
  const [scale, setScale] = useScale()
  const [artboards, saveArtboard] = useArtboards()

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
      <Suspense fallback={<div>loading</div>}>
        {Object.values(artboards).map((artboard) => (
          <ArtBoardView key={artboard.id} {...artboard} />
        ))}
      </Suspense>
    </Main>
  )

  function addArtBoard(width: number, height: number) {
    setNextArtBoardNumber((number) => number + 1)
    saveArtboard({
      id: nanoid(),
      name: `artboard ${nextArtBoardNumber}`,
      width,
      height,
      position: {
        x: 0,
        y: 0
      }
    })
  }
}

function ArtBoardView({name, width, height, id}: Artboard) {
  const [position, setPosition] = usePosition(id)
  const [handleRef, moveRef] = useDrag(position, setPosition)

  if (!position) return null

  return (
    <ArtBoardContainer ref={moveRef}>
      <Handle ref={handleRef}>
        {name} ({width}x{height})
      </Handle>
      <ArtboardCanvas artboardId={id} height={height} width={width} />
    </ArtBoardContainer>
  )
}

function ArtboardCanvas({artboardId, height, width}) {
  const [imageData, setImageData] = useImageData(artboardId)
  const canvasRef = useDrawing(imageData, setImageData)
  const [scale] = useScale()
  return (
    <Canvas
      style={{height: height * scale, width: width * scale}}
      ref={canvasRef}
      height={height}
      width={width}
    />
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
