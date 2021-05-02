import {useRef, useState, useEffect} from 'react'
import {useCurrentColor, useScale} from './state'

export function useDrawing() {
  const canvasRef = useRef<any>(null)
  const [context, setContext] = useState<any>()
  const [isDrawing, setIsDawing] = useState(false)
  const [currentColor] = useCurrentColor()
  const [scale] = useScale()

  useEffect(() => {
    const canvas = canvasRef.current

    canvas.addEventListener('mousemove', onDraw)
    canvas.addEventListener('mousedown', onStartDraw)
    canvas.addEventListener('mouseup', onEndDraw)

    const context = canvasRef.current.getContext('2d')
    setContext(context)

    return () => {
      canvas?.removeEventListener('mousemove', onDraw)
      canvas?.removeEventListener('mousedown', onStartDraw)
      canvas?.removeEventListener('mouseup', onEndDraw)
    }
  }, [onDraw, onStartDraw, onEndDraw])

  function onEndDraw(e) {
    onDraw(e)
    setIsDawing(false)
  }

  function onStartDraw(e) {
    onDraw(e)
    setIsDawing(true)
  }

  function onDraw(e) {
    if (!isDrawing || !context) return
    const rect = e.target.getBoundingClientRect()
    const centerOffset = scale / 2
    const x = Math.round((e.clientX - rect.left - centerOffset) / scale)
    const y = Math.round((e.clientY - rect.top - centerOffset) / scale)
    context.fillStyle = currentColor
    context.fillRect(x, y, 1, 1)
  }

  return canvasRef
}
