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
  const [isDrawing, setIsDawing] = useState(false)

  const [canvasRef, context, canvas] = useDrawingContext()

  useDrawing()

  const size = 32
  const scale = 8

  return (
    <ArtBoardContainer ref={moveRef}>
      <Handle ref={handleRef}>artboard</Handle>
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
    if (!isDrawing) return
    const rect = e.target.getBoundingClientRect()
    const centerOffset = scale / 2
    const x = Math.round((e.clientX - rect.left - centerOffset) / scale)
    const y = Math.round((e.clientY - rect.top - centerOffset) / scale)
    context?.fillRect(x, y, 1, 1)
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
  top: 0px;
  left: 0px;
`

const Main = styled.div`
  position: relative;
  height: 100%;

  background-color: #e5e5e5;
  color: #242422;
`
