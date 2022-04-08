import React, {useState} from 'react'
import styled from 'styled-components'
import Button from './components/Button'
import Input from './components/Input'

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
      <Button onClick={() => add(width, height)}>Add artboard</Button>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`

