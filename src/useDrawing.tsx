import {useRef, useState, useEffect} from 'react'
import {setImageData} from './firebase'
import {
  useCurrentColor,
  useCurrentTool,
  useScale,
  Tool,
  useImageData
} from './state'

export function useDrawing(artboardId) {
  const imageData = useImageData(artboardId)
  const [canvasRef, context] = useCanvas()

  const [isDrawing, setIsDawing] = useState(false)
  const [currentColor] = useCurrentColor()
  const [scale] = useScale()
  const [currentTool] = useCurrentTool()
  const [startPoint, setStartPoint] = useState<{x: number; y: number}>(null)

  const canvas = canvasRef.current

  useMouse({canvas, onMouseDown, onMouseUp, onMouseMove})

  useEffect(() => {
    if (context && imageData) {
      const image = new Image()
      image.src = imageData
      image.onload = () => {
        context.drawImage(image, 0, 0)
      }
    }
  }, [context, imageData])

  function onMouseUp(e) {
    if (!isDrawing) return
    setIsDawing(false)

    if (currentTool === Tool.Rectangle) {
      const {x, y} = getCanvasPosition(e)
      context.fillStyle = currentColor
      context.fillRect(
        startPoint.x,
        startPoint.y,
        x - startPoint.x + 1,
        y - startPoint.y + 1
      )
    } else if (currentTool === Tool.RectangleOutline) {
      const {x, y} = getCanvasPosition(e)
      context.lineWidth = 1
      context.strokeStyle = currentColor
      context.strokeRect(
        startPoint.x - 0.5,
        startPoint.y - 0.5,
        x - startPoint.x + 1,
        y - startPoint.y + 1
      )
    }

    setImageData(artboardId, canvas?.toDataURL())
  }

  function onMouseDown(e) {
    setIsDawing(true)
    setStartPoint(getCanvasPosition(e))
    mouseDownActions(e)
  }

  function mouseDownActions(e) {
    if (currentTool === Tool.Pencil) {
      const {x, y} = getCanvasPosition(e)
      context.fillStyle = currentColor
      context.fillRect(x, y, 1, 1)
    } else {
      return
    }

    setImageData(artboardId, canvas?.toDataURL())
  }

  function onMouseMove(e) {
    if (!isDrawing || !context) return

    mouseDownActions(e)
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
