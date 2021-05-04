import {nanoid} from 'nanoid'
import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import {saveArtboard} from './firebase'

export default function useDropFiles() {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const image = new Image()
      const base64 = reader.result as string
      image.src = base64
      image.onload = () => {
        saveArtboard({
          id: nanoid(),
          name: file.name,
          width: image.width,
          height: image.height,
          imageData: base64,
          position: {
            x: 100,
            y: 100
          }
        })
      }
    }
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    noClick: true
  })
  return {getRootProps, getInputProps, isDragActive}
}
