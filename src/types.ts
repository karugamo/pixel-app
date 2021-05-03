export type Artboard = {
  id: string
  name: string
  width: number
  height: number
  position: {x: number; y: number}
  context?: CanvasRenderingContext2D
}
