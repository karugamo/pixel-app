import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import { getDatabase, onValue, ref, remove, set } from "firebase/database";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { Artboard, Position } from "./types";

const provider = new GoogleAuthProvider();

const firebaseConfig = {
  apiKey: "AIzaSyA4s7hwizpOZ5IvEYM4mhRhujcfHcSXZC4",
  authDomain: "pixel-app-26bde.firebaseapp.com",
  databaseURL:
    "https://pixel-app-26bde-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pixel-app-26bde",
  storageBucket: "pixel-app-26bde.appspot.com",
  messagingSenderId: "884972653162",
  appId: "1:884972653162:web:9a56d881f2837e22809813",
};

const app = initializeApp(firebaseConfig);

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(undefined);

  useEffect(() => {
    return getAuth().onAuthStateChanged((user) => {
      console.log({ user });
      setUser(user);
    });
  }, []);

  return {user, loginStatusKnown: user !== undefined};
}

export function loginWithGoogle() {
  const auth = getAuth();
  signInWithPopup(auth, provider);
}

export function logout() {
  getAuth().signOut();
}

const currentCursor = nanoid();

export const database = getDatabase(app);

const cursorsRef = ref(database, "cursor");
const currentCursorRef = ref(database, `cursors/${currentCursor}`);
const artboardsRef = ref(database, "artboards");

export function useArtboard(artboardId: string): Artboard {
  const artboards = useArtboards();

  return artboards[artboardId];
}

export function setCursor(position: Position) {
  set(currentCursorRef, position);
}

export function useCursors() {
  const [cursors, setCursors] = useState<Record<string, Position>>({});

  useEffect(() => {
    return onValue(cursorsRef, onSnapshot);

    function onSnapshot(snapshot) {
      const allCursors = snapshot.val();
      if (allCursors) delete allCursors[currentCursor];
      setCursors(allCursors ?? {});
    }
  }, []);

  return cursors;
}

export function useArtboards(): Record<string, Artboard> {
  const [artboards, setArtboards] = useState<Record<string, Artboard>>({});
  useEffect(() => {
    return onValue(artboardsRef, onSnapshot);

    function onSnapshot(snapshot) {
      const newArtboards = snapshot.val();
      setArtboards(newArtboards ?? {});
    }
  }, []);

  return artboards;
}

export function deleteArtboard(id: string) {
  remove(ref(database, "artboards/" + id));
}

export function saveArtboard(artboard: Artboard) {
  set(ref(database, "artboards/" + artboard.id), artboard);
}

export function setPosition(
  artboardId: string,
  position: { x: number; y: number }
) {
  set(ref(database, `artboards/${artboardId}/position`), position);
}

export function setImageData(artboardId: string, imageData: string) {
  set(ref(database, `artboards/${artboardId}/imageData`), imageData);
}
