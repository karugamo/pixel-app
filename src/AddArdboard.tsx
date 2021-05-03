import React, {useState} from 'react'
import styled from 'styled-components'

type AddArtboardProps = {
  add: (width: number, height: number) => void
}

export default function AddArtboard({add}: AddArtboardProps) {
  const [width, setWidth] = useState(32)
  const [height, setHeight] = useState(32)
  return (
    <Container>
      <Input
        type="number"
        value={width}
        onChange={(e) => setWidth(Number((e.target as HTMLInputElement).value))}
      />
      <Input
        type="number"
        value={height}
        onChange={(e) =>
          setHeight(Number((e.target as HTMLInputElement).value))
        }
      />
      <button onClick={() => add(width, height)}>Add artboard</button>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`
const Input = styled.input`
  width: 50px;
`
