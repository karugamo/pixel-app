import {nanoid} from 'nanoid'
import React from 'react'
import styled from 'styled-components'
import AddArtboard from './AddArdboard'
import ColorPalette from './ColorPalette'
import {deleteArtboard, saveArtboard, useArtboards} from './firebase'
import {Tool, useCurrentArboard, useCurrentTool, useScale} from './state'

export default function Menu() {
  const [, setCurrentTool] = useCurrentTool()
  const [scale, setScale] = useScale()
  const [currentArtboard] = useCurrentArboard()

  return (
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
      {currentArtboard && <CurrentArtboard />}
    </Tools>
  )
}

function CurrentArtboard() {
  const [currentArtboardId, setCurentArtboard] = useCurrentArboard()
  const artboards = useArtboards()
  const artboard = artboards?.[currentArtboardId]

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
