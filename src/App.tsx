import React from 'react'
import styled from 'styled-components'
import Cursors from './Cursors'
import { loginWithGoogle, useAuthUser } from './firebase'
import Login from './Login'
import Menu from './Menu'
import useDropFiles from './useDropFiles'
import Workarea from './Workarea'

export default function App() {
  const {getRootProps, getInputProps, isDragActive} = useDropFiles()
  const user = useAuthUser()

  if (!user) return <Login />

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
  user-select: none;
  color: #242422;
  ${({fileDrop}) => fileDrop && `background-color: #BDB5B1;`}
`
