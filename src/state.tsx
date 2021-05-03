import {atom, useRecoilState} from 'recoil'
import {useArtboard} from './firebase'

export enum Tool {
  Pencil,
  Rectangle,
  RectangleOutline
}

const currentColor = atom({
  key: 'currentColor',
  default: '#000000'
})

export function useCurrentColor() {
  return useRecoilState(currentColor)
}

const currentTool = atom({
  key: 'currentTool',
  default: Tool.Pencil
})

export function useCurrentTool() {
  return useRecoilState(currentTool)
}

const scale = atom({
  key: 'scale',
  default: 8
})

export function useScale() {
  return useRecoilState(scale)
}

export function useImageData(
  artboardId: string
): [ImageData, (data: ImageData) => void] {
  const [artboard, saveArtboard] = useArtboard(artboardId)

  function setImageData(imageData: ImageData) {
    saveArtboard({
      ...artboard,
      imageData: {
        data: imageData.data,
        width: imageData.width,
        height: imageData.height
      }
    })
  }

  return [artboard?.imageData, setImageData]
}

export function usePosition(artboardId: string): Position {
  const [artboard] = useArtboard(artboardId)

  return artboard?.position
}

type Position = {
  x: number
  y: number
}
