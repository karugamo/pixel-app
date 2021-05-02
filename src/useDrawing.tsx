import {useRef, useState, useEffect} from 'react'
import {useCurrentColor, useCurrentTool, useScale, Tool} from './state'

export function useDrawing() {
  const [canvasRef, context] = useCanvas()

  const [isDrawing, setIsDawing] = useState(false)
  const [currentColor] = useCurrentColor()
  const [scale] = useScale()
  const [currentTool] = useCurrentTool()
  const [startPoint, setStartPoint] = useState<{x: number; y: number}>(null)

  useMouse({canvas: canvasRef.current, onMouseDown, onMouseUp, onMouseMove})

  function onMouseUp(e) {
    if (!isDrawing) return
    setIsDawing(false)

    if (currentTool === Tool.Rectangle) {
      const {x, y} = getCanvasPosition(e)
      context.fillStyle = currentColor
      context.fillRect(
        startPoint.x,
        startPoint.y,
        x - startPoint.x,
        y - startPoint.y
      )
      return
    }
    onMouseMove(e)
    setIsDawing(false)
  }

  function onMouseDown(e) {
    setIsDawing(true)
    if (currentTool === Tool.Rectangle) {
      setStartPoint(getCanvasPosition(e))
      return
    }
    onMouseMove(e)
  }

  function onMouseMove(e) {
    if (!isDrawing || !context) return

    if (currentTool === Tool.Pencil) {
      const {x, y} = getCanvasPosition(e)
      context.fillStyle = currentColor
      context.fillRect(x, y, 1, 1)
    }
  }

  function getCanvasPosition(e) {
    const rect = e.target.getBoundingClientRect()
    const centerOffset = scale / 2
    const x = Math.round((e.clientX - rect.left - centerOffset) / scale)
    const y = Math.round((e.clientY - rect.top - centerOffset) / scale)
    return {x, y}
  }

  return canvasRef
}

function useCanvas() {
  const canvasRef = useRef<any>(null)
  const [context, setContext] = useState<any>()

  useEffect(() => {
    const context = canvasRef.current.getContext('2d')
    setContext(context)
  }, [])

  return [canvasRef, context]
}

function useMouse({canvas, onMouseUp, onMouseDown, onMouseMove}) {
  useEffect(() => {
    if (!canvas) return
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [canvas, onMouseMove, onMouseDown, onMouseUp])
}
