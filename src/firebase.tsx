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

const database = firebase.database()

export function useArtboards(): [Artboard[], (artboard: Artboard) => void] {
  const [artboards, setArtboards] = useState([])
  useEffect(() => {
    database.ref('artboards').on('value', (snapshot) => {
      setArtboards(Object.values(snapshot.val()))
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
