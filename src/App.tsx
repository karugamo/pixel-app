import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import useDrag from './useDrag'
import {nanoid} from 'nanoid'
import ColorPalette from './ColorPalette'
import {useCurrentColor} from './state'

type ArtBoard = {
  id: string
  name: string
}

export default function App() {
  const [artboards, setArtboards] = useState<ArtBoard[]>([])
  const [nextArtBoardNumber, setNextArtBoardNumber] = useState(1)

  return (
    <Main>
      <Tools>
        <button onClick={addArtBoard}>Add artboard</button>
        <ColorPalette />
      </Tools>
      {artboards.map((artboard) => (
        <ArtBoardView key={artboard.id} {...artboard} />
      ))}
    </Main>
  )

  function addArtBoard() {
    setNextArtBoardNumber((number) => number + 1)
    setArtboards((artboards) => [
      ...artboards,
      {id: nanoid(), name: `artboard ${nextArtBoardNumber}`}
    ])
  }
}

function ArtBoardView({name}: ArtBoard) {
  const [handleRef, moveRef] = useDrag()
  const [isDrawing, setIsDawing] = useState(false)

  const [canvasRef, context, canvas] = useDrawingContext()

  const [currentColor] = useCurrentColor()

  useDrawing()

  const size = 32
  const scale = 8

  return (
    <ArtBoardContainer ref={moveRef}>
      <Handle ref={handleRef}>{name}</Handle>
      <Canvas
        onClick={onDraw}
        style={{height: size * scale, width: size * scale}}
        ref={canvasRef}
        height={size}
        width={size}
      />
    </ArtBoardContainer>
  )

  function useDrawing() {
    useEffect(() => {
      canvas?.addEventListener('mousemove', onDraw)
      canvas?.addEventListener('mousedown', onStartDraw)
      canvas?.addEventListener('mouseup', onEndDraw)

      return () => {
        canvas?.removeEventListener('mousemove', onDraw)
        canvas?.removeEventListener('mousedown', onStartDraw)
        canvas?.removeEventListener('mouseup', onEndDraw)
      }
    }, [canvas, onDraw, onStartDraw, onEndDraw])
  }

  function onEndDraw(e) {
    onDraw(e)
    setIsDawing(false)
  }

  function onStartDraw() {
    setIsDawing(true)
  }

  function onDraw(e) {
    if (!isDrawing || !context) return
    const rect = e.target.getBoundingClientRect()
    const centerOffset = scale / 2
    const x = Math.round((e.clientX - rect.left - centerOffset) / scale)
    const y = Math.round((e.clientY - rect.top - centerOffset) / scale)
    context.fillStyle = currentColor
    context.fillRect(x, y, 1, 1)
  }
}

function useDrawingContext() {
  const canvasRef = useRef<any>(null)
  const [context, setContext] = useState<any>()

  useEffect(() => {
    const context = canvasRef.current.getContext('2d')
    setContext(context)
  }, [])

  return [canvasRef, context, canvasRef.current]
}

const Canvas = styled.canvas`
  background-color: white;
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
