import firebase from 'firebase'
import {nanoid} from 'nanoid'
import {useEffect, useState} from 'react'
import {Artboard} from './types'

var firebaseConfig = {
  apiKey: 'AIzaSyA4s7hwizpOZ5IvEYM4mhRhujcfHcSXZC4',
  authDomain: 'pixel-app-26bde.firebaseapp.com',
  databaseURL:
    'https://pixel-app-26bde-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'pixel-app-26bde',
  storageBucket: 'pixel-app-26bde.appspot.com',
  messagingSenderId: '884972653162',
  appId: '1:884972653162:web:9a56d881f2837e22809813'
}

firebase.initializeApp(firebaseConfig)

export const database = firebase.database()

export function useArtboard(
  artboardId: string
): [Artboard, (artboard: Artboard) => void] {
  const [artboards, saveArtboard] = useArtboards()

  return [artboards[artboardId], saveArtboard]
}

type Position = {
  x: number
  y: number
}

const currentCursor = nanoid()

export function setCursor(position: Position) {
  database.ref(`cursors/${currentCursor}`).set(position)
}

export function useCursors() {
  const [cursors, setCursors] = useState<Record<string, Position>>({})

  useEffect(() => {
    database.ref('cursors').on('value', onSnapshot)

    function onSnapshot(snapshot) {
      const allCursors = snapshot.val()
      if (allCursors) delete allCursors[currentCursor]
      setCursors(allCursors ?? {})
    }

    return () => database.ref('cursors').off('value', onSnapshot)
  }, [])

  return cursors
}

export function useArtboards(): [
  Record<string, Artboard>,
  (artboard: Artboard) => void
] {
  const [artboards, setArtboards] = useState<Record<string, Artboard>>({})
  useEffect(() => {
    database.ref('artboards').on('value', onSnapshot)

    function onSnapshot(snapshot) {
      setArtboards(snapshot.val() ?? {})
    }

    return () => database.ref('artboards').off('value', onSnapshot)
  }, [])

  function saveArtboard(artboard: Artboard) {
    firebase
      .database()
      .ref('artboards/' + artboard.id)
      .set(artboard)
  }
  return [artboards, saveArtboard]
}

export function deleteArtboard(id: string) {
  firebase
    .database()
    .ref('artboards/' + id)
    .remove()
}

export function setPosition(
  artboardId: string,
  position: {x: number; y: number}
) {
  firebase.database().ref(`artboards/${artboardId}/position`).set(position)
}

export function setImageData(artboardId: string, imageData: ImageData) {
  firebase.database().ref(`artboards/${artboardId}/imageData`).set({
    data: imageData.data,
    width: imageData.width,
    height: imageData.height
  })
}
