import React, {Suspense, useState} from 'react'
import styled from 'styled-components'
import useDrag from './useDrag'
import {nanoid} from 'nanoid'
import ColorPalette from './ColorPalette'
import {
  Tool,
  useCurrentArboard,
  useCurrentTool,
  useImageData,
  usePosition,
  useScale
} from './state'
import {useDrawing} from './useDrawing'
import {Artboard} from './types'
import {deleteArtboard, useArtboards} from './firebase'
import AddArtboard from './AddArdboard'

function CurrentArtboard({artboard}: {artboard: Artboard}) {
  const [, setCurentArtboard] = useCurrentArboard()

  return (
    <div>
      <h3>{artboard?.name}</h3>
      <button onClick={onDelete}>delete board</button>
    </div>
  )

  function onDelete() {
    deleteArtboard(artboard.id)
    setCurentArtboard(null)
  }
}

export default function App() {
  const [, setCurrentTool] = useCurrentTool()
  const [scale, setScale] = useScale()
  const [artboards, saveArtboard] = useArtboards()
  const [currentArtboard] = useCurrentArboard()

  return (
    <Main>
      <Tools>
        <AddArtboard add={addArtBoard} />
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
        {currentArtboard && (
          <CurrentArtboard artboard={artboards?.[currentArtboard]} />
        )}
      </Tools>
      <Suspense fallback={<div>loading</div>}>
        {Object.values(artboards).map((artboard) => (
          <ArtBoardView key={artboard.id} {...artboard} />
        ))}
      </Suspense>
    </Main>
  )

  function addArtBoard(width: number, height: number) {
    saveArtboard({
      id: nanoid(),
      name: 'artboard',
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
  const position = usePosition(id)
  const [handleRef, moveRef] = useDrag(id, position)
  const [, setCurrentArtboard] = useCurrentArboard()

  if (!position) return null

  return (
    <ArtBoardContainer onMouseDown={() => setCurrentArtboard(id)} ref={moveRef}>
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

const Input = styled.input`
  width: 50px;
`

const ToolEntry = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`
