export type Artboard = {
  id: string
  name: string
  width: number
  height: number
  position: Position
  imageData?: string
}

export type Position = {
  x: number
  y: number
}
