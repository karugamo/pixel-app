import React from 'react'
import styled from 'styled-components'
import Cursors from './Cursors'
import Menu from './Menu'
import useDropFiles from './useDropFiles'
import Workarea from './Workarea'

export default function App() {
  const {getRootProps, getInputProps, isDragActive} = useDropFiles()

  return (
    <Main {...getRootProps()} fileDrop={isDragActive}>
      <input {...getInputProps()} />
      <Cursors />
      <Menu />
      <Workarea />
    </Main>
  )
}

const Main = styled.div<{fileDrop: boolean}>`
  position: relative;
  height: 100%;
  color: #242422;
  ${({fileDrop}) => fileDrop && `background-color: #BDB5B1;`}
`
