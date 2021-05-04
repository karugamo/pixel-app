import {nanoid} from 'nanoid'
import React, {Suspense, useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import styled from 'styled-components'
import AddArtboard from './AddArdboard'
import ColorPalette from './ColorPalette'
import Cursors from './Cursors'
import {deleteArtboard, useArtboards} from './firebase'
import {
  Tool,
  useCurrentArboard,
  useCurrentTool,
  useImageData,
  usePosition,
  useScale
} from './state'
import {Artboard} from './types'
import useDrag from './useDrag'
import {useDrawing} from './useDrawing'

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

  const {getRootProps, getInputProps, isDragActive} = useDropFiles()

  return (
    <Main {...getRootProps()} fileDrop={isDragActive}>
      <input {...getInputProps()} />
      <Cursors />
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

  function useDropFiles() {
    const onDrop = useCallback((acceptedFiles) => {
      const file = acceptedFiles[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const image = new Image()
        image.src = reader.result as string
        image.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = image.width
          canvas.height = image.height
          const context = canvas.getContext('2d')
          context.drawImage(image, 0, 0)
          const imageData = context.getImageData(
            0,
            0,
            image.width,
            image.height
          )
          saveArtboard({
            id: nanoid(),
            name: file.name,
            width: image.width,
            height: image.height,
            imageData: {
              data: imageData.data,
              width: image.width,
              height: image.height
            },
            position: {
              x: 100,
              y: 100
            }
          })
        }
      }
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
      onDrop,
      noClick: true
    })
    return {getRootProps, getInputProps, isDragActive}
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
  const imageData = useImageData(artboardId)
  const canvasRef = useDrawing(artboardId, imageData)
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

const Main = styled.div<{fileDrop: boolean}>`
  position: relative;
  height: 100%;
  color: #242422;
  ${({fileDrop}) => fileDrop && `background-color: #BDB5B1;`}
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
