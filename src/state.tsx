import {atom, useRecoilState} from 'recoil'
import {useArtboard} from './firebase'

export enum Tool {
  Pencil,
  Rectangle,
  RectangleOutline
}

const currentArtboard = atom({
  key: 'currentArtboard',
  default: null
})

export function useCurrentArboard() {
  return useRecoilState(currentArtboard)
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

export function useImageData(artboardId: string): ImageData {
  const [artboard] = useArtboard(artboardId)

  return artboard?.imageData
}

export function usePosition(artboardId: string): Position {
  const [artboard] = useArtboard(artboardId)

  return artboard?.position
}

type Position = {
  x: number
  y: number
}
