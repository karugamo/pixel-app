import React, {useEffect} from 'react'
import Cursor from './Cursor'
import {setCursor, useCursors} from './firebase'

export default function Cursors() {
  const cursors = useCursors()

  useEffect(() => {
    window.addEventListener('mousemove', (e) => {
      setCursor({x: e.pageX, y: e.pageY})
    })
  }, [])

  return (
    <>
      {Object.entries(cursors).map(([key, position]) => (
        <Cursor key={key} position={position} />
      ))}
    </>
  )
}
