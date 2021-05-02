import {atom, useRecoilState} from 'recoil'

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
