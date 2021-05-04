import React from 'react'
import styled from 'styled-components'
import {useArtboards} from './firebase'
import {useCurrentArboard, usePosition, useScale} from './state'
import {Artboard} from './types'
import useDrag from './useDrag'
import {useDrawing} from './useDrawing'

export default function Workarea() {
  const artboards = useArtboards()
  return (
    <>
      {Object.values(artboards).map((artboard) => (
        <ArtBoardView key={artboard.id} {...artboard} />
      ))}
    </>
  )
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

const ArtboardCanvas = React.memo(function InnerArtboardCanvas({
  artboardId,
  height,
  width
}: any) {
  const canvasRef = useDrawing(artboardId)
  const [scale] = useScale()
  return (
    <Canvas
      style={{height: height * scale, width: width * scale}}
      ref={canvasRef}
      height={height}
      width={width}
    />
  )
})

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
