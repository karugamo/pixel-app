import React, {useEffect, useRef} from 'react'
import {setPosition} from './firebase'

function useDrag(
  artboardId,
  position
): [
  React.MutableRefObject<any>,
  React.MutableRefObject<any>,
  {x: number; y: number},
  any
] {
  const handleRef = useRef(null)
  const moveRef = useRef(null)

  useEffect(() => {
    if (moveRef.current)
      moveRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`
  }, [position])

  useEffect(() => {
    const moveTarget = moveRef.current
    const handleTarget = handleRef.current

    if (!moveTarget || !handleTarget) return
    const previousOffset = {x: position.x, y: position.y}
    let originMouseX
    let originMouseY
    function onMousemove(e) {
      const {pageX, pageY} = e
      const x = pageX - originMouseX + previousOffset.x
      const y = pageY - originMouseY + previousOffset.y
      setPosition(artboardId, {x, y})
    }
    function onMouseup(e) {
      previousOffset.x += e.pageX - originMouseX
      previousOffset.y += e.pageY - originMouseY
      window.removeEventListener('mousemove', onMousemove)
      window.removeEventListener('mouseup', onMouseup)
    }
    function onMousedown(e) {
      originMouseX = e.pageX
      originMouseY = e.pageY
      window.addEventListener('mousemove', onMousemove)
      window.addEventListener('mouseup', onMouseup)
    }
    handleTarget.addEventListener('mousedown', onMousedown)
    return () => {
      handleTarget.removeEventListener('mousedown', onMousedown)
      window.removeEventListener('mouseup', onMouseup)
      window.removeEventListener('mousemove', onMousemove)
    }
  }, [Boolean(position)])

  return [handleRef, moveRef, position, setPosition]
}

export default useDrag
