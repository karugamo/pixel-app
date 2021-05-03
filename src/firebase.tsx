import firebase from 'firebase'
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

export function useArtboards(): [
  Record<string, Artboard>,
  (artboard: Artboard) => void
] {
  const [artboards, setArtboards] = useState<Record<string, Artboard>>({})
  useEffect(() => {
    database.ref('artboards').on('value', (snapshot) => {
      setArtboards(snapshot.val() ?? {})
    })
  }, [])

  function saveArtboard(artboard: Artboard) {
    firebase
      .database()
      .ref('artboards/' + artboard.id)
      .set(artboard)
  }
  return [artboards, saveArtboard]
}

export function setPosition(
  artboardId: string,
  position: {x: number; y: number}
) {
  firebase.database().ref(`artboards/${artboardId}/position`).set(position)
}
