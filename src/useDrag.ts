import {useEffect, useRef} from 'react'

// slightly modified from https://github.com/ShizukuIchi/use-drag/blob/master/src/index.js

function useDrag() {
  const handleRef = useRef(null)
  const moveRef = useRef(null)
  useEffect(() => {
    const moveTarget = moveRef.current
    const handleTarget = handleRef.current

    if (!moveTarget || !handleTarget) return
    const previousOffset = {x: 0, y: 0}
    let originMouseX
    let originMouseY
    function onMousemove(e) {
      const {pageX, pageY} = e
      const x = pageX - originMouseX + previousOffset.x
      const y = pageY - originMouseY + previousOffset.y
      moveTarget.style.transform = `translate(${x}px, ${y}px)`
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
  })
  return [handleRef, moveRef]
}

export default useDrag
