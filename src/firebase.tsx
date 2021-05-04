import firebase from 'firebase'
import {nanoid} from 'nanoid'
import {useEffect, useState} from 'react'
import {Artboard, Position} from './types'

const firebaseConfig = {
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

export function useArtboard(artboardId: string): Artboard {
  const artboards = useArtboards()

  return artboards[artboardId]
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

export function useArtboards(): Record<string, Artboard> {
  const [artboards, setArtboards] = useState<Record<string, Artboard>>({})
  useEffect(() => {
    database.ref('artboards').on('value', onSnapshot)

    function onSnapshot(snapshot) {
      const newArtboards = snapshot.val()
      setArtboards(newArtboards ?? {})
    }

    return () => database.ref('artboards').off('value', onSnapshot)
  }, [])

  return artboards
}

export function deleteArtboard(id: string) {
  firebase
    .database()
    .ref('artboards/' + id)
    .remove()
}

export function saveArtboard(artboard: Artboard) {
  firebase
    .database()
    .ref('artboards/' + artboard.id)
    .set(artboard)
}

export function setPosition(
  artboardId: string,
  position: {x: number; y: number}
) {
  firebase.database().ref(`artboards/${artboardId}/position`).set(position)
}

export function setImageData(artboardId: string, imageData: string) {
  firebase.database().ref(`artboards/${artboardId}/imageData`).set(imageData)
}
